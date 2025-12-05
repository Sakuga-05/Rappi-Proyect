import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // Configuración del chatbot (se carga desde assets/chatbot-config.json)
  private configUrl = 'assets/chatbot-config.json';
  private ai: GoogleGenerativeAI | null = null;
  private systemPrompt = '';
  private model = 'gemini-2.5-flash';
  private temperature = 0.3;
  private initialized = false;

  constructor(private http: HttpClient) { }

  // Saludo inicial para mostrar al cargar el chat
  getInitialGreeting(): Observable<{ reply: string }> {
    return this.ensureConfigured().pipe(
      map(() => ({ reply: '¡Hola! Soy tu asistente de delivery. Puedo ayudarte a gestionar restaurantes, productos, pedidos, conductores, motocicletas, turnos e inconvenientes. ¿En qué te ayudo hoy?' }))
    );
  }

  // Envía el mensaje a Gemini
  sendMessage(prompt: string): Observable<{ reply: string }> {
    return this.ensureConfigured().pipe(
      switchMap(() => this.callGemini(prompt)),
      catchError(() => of(this.mockReply(prompt)).pipe(delay(400)))
    );
  }

  private ensureConfigured(): Observable<void> {
    if (this.initialized && this.ai) {
      return of(void 0);
    }
    return this.http.get<any>(this.configUrl).pipe(
      map(cfg => {
        this.systemPrompt = cfg?.systemPrompt || this.systemPrompt;
        this.model = cfg?.model || this.model;
        this.temperature = typeof cfg?.temperature === 'number' ? cfg.temperature : this.temperature;
        const apiKey = cfg?.apiKey || (window as any).GEMINI_API_KEY || (window as any)["env:GEMINI_API_KEY"];
        if (!apiKey) {
          throw new Error('API key de Gemini no configurada. Define apiKey en assets/chatbot-config.json o (window as any).GEMINI_API_KEY');
        }
        this.ai = new GoogleGenerativeAI(apiKey);
        this.initialized = true;
      })
    );
  }

  private callGemini(prompt: string): Observable<{ reply: string }> {
    if (!this.ai) {
      return of(this.mockReply(prompt));
    }
    const final = `${this.systemPrompt}\n\nConsulta del usuario: ${prompt}`;
    return new Observable(observer => {
      try {
        const model = this.ai!.getGenerativeModel({ model: this.model });
        model.generateContent(final).then(result => {
          const text = (result as any)?.response?.text?.() ?? JSON.stringify(result);
          observer.next({ reply: text });
          observer.complete();
        }).catch(err => observer.error(err));
      } catch (err) {
        observer.error(err);
      }
    });
  }

  private mockReply(prompt: string): { reply: string } {
    const text = prompt?.toLowerCase() || '';

    if (text.includes('para qué') || text.includes('para que') || text.includes('sirve')) {
      return { reply: 'Este sistema es una plataforma de gestión y entrega: administra restaurantes, productos, pedidos, conductores y turnos, además de permitir a los clientes realizar pedidos y gestionar sus direcciones.' };
    }

    if (text.includes('registrar') && text.includes('conductor')) {
      return { reply: 'Puedes registrar un nuevo conductor desde la sección Conductores → Crear. En el menú lateral selecciona "Conductores" y luego pulsa "Crear".' };
    }

    if (text.includes('realizar') && (text.includes('pedido') || text.includes('comprar'))) {
      return { reply: 'Para realizar un pedido ve a "Pedidos" → "Crear" o usa la opción "Comprar Comida" en la pantalla principal del usuario para navegar por restaurantes y agregar productos al carrito.' };
    }

    // respuestas por defecto
    return { reply: 'Lo siento, no entiendo la pregunta exactamente. Puedes preguntar: "¿Para qué sirve este sistema?", "¿Dónde puedo registrar un nuevo conductor?" o "¿En qué parte puedo realizar un pedido?"' };
  }
}
