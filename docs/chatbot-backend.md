# Chatbot Backend Proxy (Gemini)

Este documento muestra un ejemplo mínimo de cómo exponer un endpoint `/api/gemini` en el backend que haga de proxy seguro hacia la API de Gemini. Nunca pongas la API Key en el frontend.

## Requisitos
- Node.js 18+
- Instalar dependencias: `npm install express axios dotenv`

## Variables de entorno (archivo `.env`)
```
PORT=5000
GEMINI_API_KEY=sk-...  # tu clave privada de Gemini
GEMINI_ENDPOINT=https://api.gemini.example/v1/generate
```

> Ajusta `GEMINI_ENDPOINT` al endpoint oficial que uses. El ejemplo usa `axios` para postear.

## Ejemplo mínimo (Express)
```js
// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT = process.env.GEMINI_ENDPOINT;

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY no definido en variables de entorno.');
}

app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt requerido' });

  try {
    // Ejemplo genérico: adapta body según la API de Gemini real
    const payload = {
      prompt,
      max_tokens: 512
    };

    const response = await axios.post(GEMINI_ENDPOINT, payload, {
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Adaptar según la estructura de respuesta de Gemini
    const reply = response.data?.choices?.[0]?.text || response.data?.output || JSON.stringify(response.data);
    res.json({ reply });
  } catch (err) {
    console.error('Error calling Gemini:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Error en el servicio de IA' });
  }
});

app.listen(PORT, () => console.log(`Proxy API listening on ${PORT}`));
```

## Notas de seguridad
- Mantén `GEMINI_API_KEY` en variables de entorno del servidor (no en el repositorio).
- Limita el uso por IP o añade autenticación (ej. JWT) para que sólo usuarios registrados puedan llamar al endpoint.
- Considera límites de tasa y caché para prompts frecuentes.

## Búsqueda de contexto en el repo (RAG simple)

El ejemplo `server.js` incluido en el repositorio hace más que reenviar la petición: indexa (de forma simple) los archivos de tu proyecto y extrae fragmentos relevantes basados en palabras clave de la pregunta. Luego construye un prompt que incluye esos fragmentos como "context" antes de llamar a la API de Gemini. Esto permite que el asistente conteste preguntas sobre la página/proyecto con información real del código y documentación, sin necesidad de exponer la API key al frontend.

Puntos importantes:
- El motor de búsqueda incluido es simple (conteo de coincidencias por token). Para producción considera usar un motor de embeddings + vector DB (Pinecone/Weaviate/Chroma) para mejor relevancia.
- Puedes configurar la ruta raíz indexada con la variable `REPO_ROOT` en `.env`.
- Si `GEMINI_API_KEY` no está presente, el proxy devolverá un resumen del contexto encontrado como respuesta alternativa.

## Probar localmente
1. Coloca `.env` con la API key y endpoint.
2. `node server.js`
3. En el frontend (ejecutando `npm start`), abre `http://localhost:4200/chatbot` y envía preguntas. El frontend llamará a `/api/gemini` que será proxied por `proxy.conf.json` al backend `http://127.0.0.1:5000`.

Si no tienes la API de Gemini disponible, el frontend usa respuestas mock que atienden las preguntas frecuentes solicitadas.
