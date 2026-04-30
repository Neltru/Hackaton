import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompanyMensajesService, Conversation } from '../../../core/services/company-mensajes.service';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent implements OnInit, AfterViewChecked {
  conversations: Conversation[] = [];
  activeConversation: Conversation | null = null;
  newMessageText: string = '';

  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  constructor(
    private mensajesService: CompanyMensajesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Suscribirse a los cambios en las conversaciones
    this.mensajesService.getConversations().subscribe((convs: Conversation[]) => {
      this.conversations = convs;
      // Actualizar la conversación activa si cambió (por un nuevo mensaje)
      if (this.activeConversation) {
        const currentId = this.activeConversation.id;
        this.activeConversation = convs.find(c => c.id === currentId) || null;
      }
    });

    // Check if we navigated here via "Invitar" with query params
    this.route.queryParams.subscribe((params: any) => {
      const startConv = params['startConv'];
      if (startConv && this.conversations.length > 0) {
        const target = this.conversations.find(c => c.id === startConv);
        if (target) {
          this.selectConversation(target);
        }
      } else if (!this.activeConversation && this.conversations.length > 0) {
        // Seleccionar la primera por defecto si no hay nada activo
        this.selectConversation(this.conversations[0]);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  selectConversation(conv: Conversation): void {
    this.activeConversation = conv;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  sendMessage(): void {
    if (this.newMessageText.trim() && this.activeConversation) {
      this.mensajesService.sendMessage(this.activeConversation.id, this.newMessageText);
      this.newMessageText = '';
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
}
