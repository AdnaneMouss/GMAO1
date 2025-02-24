import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../models/intervention';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) {}

  getAllInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.apiUrl);
  }

  createIntervention(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(this.apiUrl, intervention);
  }

  deleteIntervention(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
