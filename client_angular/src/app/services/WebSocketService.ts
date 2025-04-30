import { Injectable } from '@angular/core'; 
import { Subject } from 'rxjs';
import { ChatMessage } from '../models/ChatMessage';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';



@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private messageSubject = new Subject<ChatMessage>();

  connect() {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: any) => {
      console.log('✅ Connecté au WebSocket :', frame);

      // Canal public
      this.stompClient.subscribe('/topic/public', (message: any) => {
        console.log('🌍 Message public reçu', message.body);
        this.messageSubject.next(JSON.parse(message.body));
      });

      // Canal privé (spécifique à l'utilisateur connecté)
      this.stompClient.subscribe('/user/queue/private', (message: any) => {
        console.log('🔒 Message privé reçu', message.body);
        this.messageSubject.next(JSON.parse(message.body));
      });
    }, (error: any) => {
      console.error('❌ Erreur WebSocket :', error);
    });
  }

  sendMessage(message: ChatMessage) {
    this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
  }

  sendPrivateMessage(message: ChatMessage) {
    this.stompClient.send('/app/chat.sendPrivateMessage', {}, JSON.stringify(message));
  }

  onMessage() {
    return this.messageSubject.asObservable();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}
