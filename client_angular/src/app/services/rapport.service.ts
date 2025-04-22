import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportService {

  private apiUrl = 'http://localhost:8080/api/raports'; // à adapter selon ton backend

  constructor(private http: HttpClient) {}

  generateReportFile(type: 'weekly' | 'monthly'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/generate?type=${type}`, {
      responseType: 'blob', // pour recevoir un fichier (PDF, Excel, etc.)
    });
  }
}
