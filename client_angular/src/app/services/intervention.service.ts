import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../models/intervention';
import {PieceDetachee} from "../models/piece-detachee";

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) {}

  getInterventionsByTechnician(technicianId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/technicien/${technicianId}`);
  }

  // Updated createIntervention method to handle file upload and PieceDetachee
  createIntervention(
    files: File[] | null,
    description: string,
    remarques: string | null,
    maintenanceId: number,
    technicienId: number,
    pieceDetacheesIds: number[],
    quantites: number[]
  ): Observable<any> {
    const formData: FormData = new FormData();

    // Append files to FormData if any
    if (files) {
      files.forEach((file, index) => {
        formData.append('files', file, file.name);
      });
    }

    // Append other form data
    formData.append('description', description);
    if (remarques) {
      formData.append('remarques', remarques);
    }
    formData.append('maintenanceId', maintenanceId.toString());
    formData.append('technicienId', technicienId.toString());
    formData.append('piecesDetachees', JSON.stringify(pieceDetacheesIds));
    formData.append('quantites', JSON.stringify(quantites));

    // Make the HTTP request to the backend
    return this.http.post(`${this.apiUrl}/create`, formData);
  }

  getPiecesByInterventionId(interventionId: number): Observable<PieceDetachee[]> {
    return this.http.get<PieceDetachee[]>(`${this.apiUrl}/${interventionId}/pieces`);
  }


}
