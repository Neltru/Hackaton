import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CompanyCandidatosService, CandidatoIdoneo } from '../services/company-candidatos.service';
import { CompanyVacantesService, CompanyVacante } from '../services/company-vacantes.service';

export interface ChatMessage {
  id: string;
  sender: 'company' | 'egresado';
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string; // formato: vacanteId_egresadoId
  vacanteId: string;
  egresadoId: string;
  candidato?: CandidatoIdoneo;
  vacante?: CompanyVacante;
  messages: ChatMessage[];
  lastMessageAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyMensajesService {

  private mockConversations: Conversation[] = [];
  private conversationsSubject = new BehaviorSubject<Conversation[]>(this.mockConversations);

  constructor(
    private candidatosService: CompanyCandidatosService,
    private vacantesService: CompanyVacantesService
  ) { }

  getConversations(): Observable<Conversation[]> {
    return this.conversationsSubject.asObservable();
  }

  getConversationById(id: string): Conversation | undefined {
    return this.mockConversations.find(c => c.id === id);
  }

  /**
   * Inicia o recupera una conversación existente entre empresa y egresado.
   */
  startConversation(vacanteId: string, egresadoId: string): string {
    const convId = `${vacanteId}_${egresadoId}`;
    const existing = this.mockConversations.find(c => c.id === convId);

    if (existing) {
      return convId;
    }

    // Resolve details for UI
    let candidatoInfo: CandidatoIdoneo | undefined;
    this.candidatosService.getCandidatosIdoneos({ psicometrico: 0, cognitivo: 0, tecnico: 0, proyectivo: 0 }, undefined, undefined, 0)
      .subscribe(cands => {
        candidatoInfo = cands.find(c => c.id === egresadoId);
      });

    const vacanteInfo = this.vacantesService.getVacanteById(vacanteId);

    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'company',
      text: `Hola ${candidatoInfo?.nombre || ''}, nos impresionó tu perfil y creemos que encajas perfectamente en nuestra vacante de ${vacanteInfo?.title || ''}. ¿Estarías interesado en conversar?`,
      timestamp: new Date()
    };

    const newConv: Conversation = {
      id: convId,
      vacanteId,
      egresadoId,
      candidato: candidatoInfo,
      vacante: vacanteInfo,
      messages: [initialMessage],
      lastMessageAt: new Date()
    };

    this.mockConversations = [newConv, ...this.mockConversations];
    this.conversationsSubject.next(this.mockConversations);

    // Simular respuesta del egresado después de 3 segundos
    setTimeout(() => {
      this.simulateReply(convId);
    }, 3000);

    return convId;
  }

  sendMessage(convId: string, text: string): void {
    const conv = this.mockConversations.find(c => c.id === convId);
    if (conv) {
      conv.messages.push({
        id: Date.now().toString(),
        sender: 'company',
        text,
        timestamp: new Date()
      });
      conv.lastMessageAt = new Date();
      this.conversationsSubject.next(this.mockConversations);

      // Simular respuesta
      setTimeout(() => {
        this.simulateReply(convId);
      }, 4000);
    }
  }

  private simulateReply(convId: string) {
    const conv = this.mockConversations.find(c => c.id === convId);
    if (conv) {
      const replies = [
        '¡Hola! Muchas gracias por el interés. Sí, me gustaría saber más.',
        'Claro, podemos agendar una entrevista esta semana.',
        'Excelente, quedo atento a los siguientes pasos.',
        '¿Podríamos tener una videollamada para platicar los detalles?'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      conv.messages.push({
        id: Date.now().toString(),
        sender: 'egresado',
        text: randomReply,
        timestamp: new Date()
      });
      conv.lastMessageAt = new Date();

      // Mover la conversación al inicio
      this.mockConversations = [
        conv,
        ...this.mockConversations.filter(c => c.id !== convId)
      ];
      this.conversationsSubject.next(this.mockConversations);
    }
  }
}
