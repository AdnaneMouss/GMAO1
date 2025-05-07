// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/ChatMessage';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) {}

  sendChatMessage(message: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${this.apiUrl}/send`, message);
  }

  getChatHistory(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history`);
  }
  getUnreadMessagesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unreadMessagesCount`).pipe(
      tap(count => {
        // Logique si tu veux faire quelque chose avec le count
        console.log('Unread messages count:', count);
      })
    );
  }
}
