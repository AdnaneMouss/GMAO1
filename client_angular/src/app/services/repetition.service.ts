import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { repetitionInstances } from '../models/repetitionInstances';


@Injectable({
  providedIn: 'root'
})
export class RepetitionService {

  private  apiUrl = 'http://localhost:8080/api/repetitions'; // Adaptable selon ton backend

  constructor(private http: HttpClient) {}
 getAllRepetitions(): Observable<repetitionInstances[]> {
    return this.http.get<repetitionInstances[]>(`${this.apiUrl}`);
  }
   startTask(id: number): Observable<repetitionInstances> {
      return this.http.put<repetitionInstances>(`${this.apiUrl}/${id}/start`, {});
    }

  // ✅ Récupérer les répétitions par maintenanceId
   getRepetitionsByMaintenanceId(maintenanceId: number): Observable<repetitionInstances[]> {
    return this.http.get<repetitionInstances[]>(`${this.apiUrl}/maintenance/${maintenanceId}`);
  }

  // ✅ Démarrer une répétition
  startRepetition(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/start`, {});
  }

  // ✅ Terminer une répétition
  completeRepetition(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/complete`, {});
  }
}
