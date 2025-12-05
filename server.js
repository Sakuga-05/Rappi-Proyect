require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim() || null;
const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT || null; // legacy support (not used with @google/genai)
const REPO_ROOT = process.env.REPO_ROOT || path.resolve(__dirname);
const CHATBOT_CONFIG_PATH = path.join(REPO_ROOT, 'src', 'assets', 'chatbot-config.json');
let CHATBOT_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.3,
  systemPrompt: 'Eres un asistente para una plataforma de servicios de delivery. Ayudas a usuarios y administradores a gestionar restaurantes, productos, pedidos, conductores, motocicletas, turnos e inconvenientes. Indica cómo usar la barra lateral (sidebar) para acceder a cada entidad y realizar acciones de crear, modificar y gestionar. Responde claro y conciso; usa pasos numerados cuando corresponda.'
};

function loadChatbotConfig() {
  try {
    if (fs.existsSync(CHATBOT_CONFIG_PATH)) {
      const raw = fs.readFileSync(CHATBOT_CONFIG_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      CHATBOT_CONFIG = { ...CHATBOT_CONFIG, ...parsed };
      console.log('Chatbot config loaded from', CHATBOT_CONFIG_PATH);
    } else {
      console.log('Chatbot config file not found, using defaults');
    }
  } catch (e) {
    console.warn('Failed to load chatbot-config.json, using defaults', e.message);
  }
}
loadChatbotConfig();

// In-memory index cache to avoid re-reading files on every query
let fileIndex = null; // [{ path: relativePath, content, ext }]

const PRIORITY_DIRS = ['docs', 'src', 'app'];

function isBinaryFile(filePath) {
  const binaryExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.zip', '.gz', '.tgz', '.woff', '.woff2', '.ttf'];
  return binaryExtensions.includes(path.extname(filePath).toLowerCase());
}

async function readAllFiles(dir, fileList = []) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'dist'].includes(entry.name)) continue;
      await readAllFiles(full, fileList);
    } else {
      if (isBinaryFile(full)) continue;
      fileList.push(full);
    }
  }
  return fileList;
}

async function buildIndex() {
  const files = await readAllFiles(REPO_ROOT);
  const arr = [];
  for (const f of files) {
    try {
      const content = await fs.promises.readFile(f, 'utf8');
      arr.push({ path: path.relative(REPO_ROOT, f), content, ext: path.extname(f).toLowerCase() });
    } catch (e) {
      // ignore read errors
    }
  }
  // sort index to prefer docs/README and source files
  arr.sort((a,b) => {
    const aPri = PRIORITY_DIRS.some(d => a.path.startsWith(d)) ? 1 : 0;
    const bPri = PRIORITY_DIRS.some(d => b.path.startsWith(d)) ? 1 : 0;
    if (aPri !== bPri) return bPri - aPri;
    // prefer markdown and small files first
    if (a.ext === '.md' && b.ext !== '.md') return -1;
    if (b.ext === '.md' && a.ext !== '.md') return 1;
    return a.path.localeCompare(b.path);
  });
  fileIndex = arr;
  console.log(`Indexed ${arr.length} files for retrieval.`);
}

function extractRelevantSnippets(content, tokens, maxSnippets = 5) {
  const lines = content.split(/\r?\n/);
  const scored = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    let score = 0;
    for (const t of tokens) if (t && line.includes(t)) score++;
    if (score > 0) scored.push({ index: i, line, score });
  }
  scored.sort((a,b) => b.score - a.score);
  const snippets = [];
  const used = new Set();
  for (const s of scored.slice(0, maxSnippets * 2)) {
    // build a window of lines around the match
    const start = Math.max(0, s.index - 2);
    const end = Math.min(lines.length - 1, s.index + 2);
    const key = `${start}-${end}`;
    if (used.has(key)) continue;
    used.add(key);
    const text = lines.slice(start, end + 1).join('\n').trim();
    snippets.push({ lineNumber: start + 1, text });
    if (snippets.length >= maxSnippets) break;
  }
  return snippets;
}

async function retrieveContext(prompt, maxFiles = 10) {
  const tokens = prompt.toLowerCase().split(/\W+/).filter(Boolean);
  // keep some top tokens by frequency
  const freq = {};
  for (const t of tokens) freq[t] = (freq[t] || 0) + 1;
  const topTokens = Object.keys(freq).sort((a,b) => freq[b]-freq[a]).slice(0,60);

  if (!fileIndex) {
    await buildIndex();
  }

  const candidates = [];
  for (const f of fileIndex) {
    const lc = f.content.toLowerCase();
    let hits = 0;
    for (const t of topTokens) if (t && lc.includes(t)) hits++;
    if (hits > 0) {
      const snippets = extractRelevantSnippets(f.content, topTokens, 4);
      candidates.push({ path: f.path, hits, snippets, ext: f.ext });
    }
  }
  // sort by hits, but bump README/markdown and priority dirs
  candidates.sort((a,b) => {
    const aPri = PRIORITY_DIRS.some(d => a.path.startsWith(d)) ? 1 : 0;
    const bPri = PRIORITY_DIRS.some(d => b.path.startsWith(d)) ? 1 : 0;
    if (aPri !== bPri) return bPri - aPri;
    if (a.ext === '.md' && b.ext !== '.md') return -1;
    if (b.ext === '.md' && a.ext !== '.md') return 1;
    return b.hits - a.hits;
  });

  const top = candidates.slice(0, maxFiles);
  let context = '';
  for (const file of top) {
    context += `File: ${file.path}\n`;
    for (const s of file.snippets) context += `  ${s.lineNumber}: ${s.text}\n`;
    context += '\n';
  }
  if (!context) context = 'No se encontraron fragmentos relevantes en el repositorio.';
  return { context, candidates: top };
}

// Endpoint para forzar rebuild del índice sin reiniciar el servidor
app.post('/api/refresh-index', async (req, res) => {
  try {
    await buildIndex();
    return res.json({ ok: true, filesIndexed: fileIndex.length });
  } catch (err) {
    console.error('Error rebuilding index', err);
    return res.status(500).json({ error: 'Error al reconstruir el índice' });
  }
});

app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt requerido' });

  try {
    const { context, candidates } = await retrieveContext(prompt, 8);
    const system = CHATBOT_CONFIG.systemPrompt;
    const finalPrompt = `${system}\n\nContexto del repo (extractos):\n${context}\n---\nConsulta del usuario: ${prompt}`;

    // Preferir cliente oficial @google/genai si hay API key
    if (GEMINI_API_KEY) {
      try {
        // Inicialización estilo ejemplo: toma la API key de GEMINI_API_KEY
        const ai = new GoogleGenAI({});
        const response = await ai.models.generateContent({
          model: CHATBOT_CONFIG.model || 'gemini-2.5-flash',
          contents: finalPrompt,
        });
        const reply = response?.text || response?.outputText || JSON.stringify(response);
        return res.json({ reply });
      } catch (e) {
        console.error('Error llamando a @google/genai', e);
        // Continúa con fallback local abajo
      }
    }

    // Fallback: si no hay API key, intentamos generar una respuesta útil localmente.
    // 1) Si existe README.md, devolver el primer párrafo como explicación general.
    try {
      const readmePaths = ['README.md', 'README', 'docs/README.md'];
      for (const rp of readmePaths) {
        const p = path.join(REPO_ROOT, rp);
        if (fs.existsSync(p)) {
          const readme = await fs.promises.readFile(p, 'utf8');
          const paragraphs = readme.split(/\r?\n\r?\n/).map(s => s.trim()).filter(Boolean);
          if (paragraphs.length > 0) {
            const summary = paragraphs[0].replace(/\r?\n/g, ' ');
            return res.json({ reply: `Resumen del README: ${summary}` });
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // 2) Si no hay README, construir un resumen conciso a partir de los snippets más relevantes
    if (candidates && candidates.length > 0) {
      let reply = 'Información encontrada en el repositorio relacionada con su consulta:\n\n';
      for (const file of candidates.slice(0,6)) {
        reply += `Archivo: ${file.path}\n`;
        for (const s of (file.snippets || []).slice(0,2)) {
          reply += `  - ${s.text.trim()}\n`;
        }
        reply += '\n';
      }
      reply += '---\nSi desea respuestas más elaboradas, configure GEMINI_API_KEY y GEMINI_ENDPOINT en el servidor.';
      // limitar tamaño
      if (reply.length > 3500) reply = reply.slice(0,3500) + '...';
      return res.json({ reply });
    }

    // Último recurso
    return res.json({ reply: `No se encontró información relevante en el repositorio. Si desea respuestas más completas, configure GEMINI_API_KEY y GEMINI_ENDPOINT en el servidor.` });

  } catch (err) {
    console.error('Error en /api/gemini', err);
    res.status(500).json({ error: 'Error interno en el proxy' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy API listening on http://localhost:${PORT}`);
  console.log(`Repo root used for retrieval: ${REPO_ROOT}`);
});
