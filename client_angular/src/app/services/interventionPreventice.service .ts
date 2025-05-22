import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention } from '../models/intervention';
import {PieceDetachee} from "../models/piece-detachee";
import {InterventionPieceDetachee} from "../models/intervention-pieces";

@Injectable({
  providedIn: 'root'
})
export class InterventionPreventiceService {
  private apiUrl = 'http://localhost:8080/api/interventions';

  constructor(private http: HttpClient) {}

  getInterventionsByTechnician(technicianId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/technicien/${technicianId}`);
  }

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

    // 📸 Append files
    if (files) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }

    // 📑 Append scalar fields
    formData.append('description', description);
    if (remarques) {
      formData.append('remarques', remarques);
    }
    formData.append('maintenanceId', maintenanceId.toString());
    formData.append('technicienId', technicienId.toString());

    // 🔩 Append piecesDetachees and quantites as individual values
    pieceDetacheesIds.forEach(id => {
      formData.append('piecesDetachees', id.toString());
    });
    quantites.forEach(qty => {
      formData.append('quantites', qty.toString());
    });

    // 🚀 Send the form data
    return this.http.post(`${this.apiUrl}/createP`, formData);
  }


  getPiecesByInterventionId(interventionId: number): Observable<PieceDetachee[]> {
    return this.http.get<PieceDetachee[]>(`${this.apiUrl}/${interventionId}/pieces`);
  }

  getPiecesDetachees(interventionId: number): Observable<InterventionPieceDetachee[]> {
    return this.http.get<InterventionPieceDetachee[]>(`${this.apiUrl}/${interventionId}/pieces-detachees`);
  }


}
