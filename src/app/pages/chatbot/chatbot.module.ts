import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotRoutingModule } from './chatbot-routing.module';
import { ChatbotComponent } from './chatbot.component';

@NgModule({
  declarations: [ChatbotComponent],
  imports: [CommonModule, FormsModule, ChatbotRoutingModule]
})
export class ChatbotModule { }
