import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';

interface Message { from: 'user' | 'bot'; text: string }

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('scrollArea') private scrollArea!: ElementRef;

  messages: Message[] = [];
  inputText = '';
  loading = false;

  constructor(private chatbot: ChatbotService) { }

  ngOnInit(): void {
    this.messages.push({ from: 'bot', text: 'Hola 👋 Soy el yeti asistente del sistema. Pregúntame por funciones, registro de conductores o cómo realizar pedidos.' });
    setTimeout(() => this.scrollToBottom(), 50);
  }

  send() {
    const text = this.inputText && this.inputText.trim();
    if (!text) return;

    this.messages.push({ from: 'user', text });
    this.inputText = '';
    this.loading = true;
    this.scrollToBottom();

    this.chatbot.sendMessage(text).subscribe(resp => {
      this.loading = false;
      this.messages.push({ from: 'bot', text: resp.reply });
      setTimeout(() => this.scrollToBottom(), 50);
    }, err => {
      this.loading = false;
      this.messages.push({ from: 'bot', text: 'Hubo un error al contactar el asistente. Intenta de nuevo más tarde.' });
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  private scrollToBottom() {
    try {
      if (this.scrollArea && this.scrollArea.nativeElement) {
        const el = this.scrollArea.nativeElement as HTMLElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) { }
  }
}
