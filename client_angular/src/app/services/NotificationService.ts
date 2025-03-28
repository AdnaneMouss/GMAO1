import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = '/api/notifications'; // URL du backend

  constructor(private http: HttpClient) {}

  addNotification(notification: { id: number; message: string }): Observable<any> {
    return this.http.post(this.apiUrl, notification);
  }
}