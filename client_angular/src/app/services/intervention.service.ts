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
    interventionData: {
      description: string;
      remarques: string;
      maintenanceId: number;
      technicienId: number;
      piecesDetachees:number[];  // List of PieceDetachee objects
    },
    file: File
  ): Observable<Intervention> {
    const formData = new FormData();
    formData.append('file', file);  // Append the file to the form data
    formData.append('description', interventionData.description);
    formData.append('remarques', interventionData.remarques);
    formData.append('maintenanceId', interventionData.maintenanceId.toString());  // Append the maintenanceId
    formData.append('technicienId', interventionData.technicienId.toString());  // Append the technician's ID

    formData.append('piecesDetachees', interventionData.piecesDetachees.join(','));


    return this.http.post<Intervention>(`${this.apiUrl}/create`, formData);
  }
createInterventionP(
  files: File[] | null,
  description: string,
  remarques: string,
  maintenanceId: number, // 👈 nom corrigé ici
  technicienId: number,
  pieceDetacheeIds: number[],
  quantites: number[],
  repetitionId: number | null
): Observable<any> {
  const formData = new FormData();

  if (files) {
    for (const file of files) {
      formData.append('files', file);
    }
  }

  formData.append('description', description);
  formData.append('remarques', remarques || '');
  formData.append('maintenanceId', maintenanceId.toString()); // 👈 nom corrigé ici
  formData.append('technicienId', technicienId.toString());

  pieceDetacheeIds.forEach(id => {
    formData.append('piecesDetachees', id.toString());
  });

  quantites.forEach(qte => {
    formData.append('quantites', qte.toString());
  });

  if (repetitionId !== null && repetitionId !== undefined) {
    formData.append('repetitionId', repetitionId.toString());
  }

  return this.http.post(`${this.apiUrl}/createP`, formData);
}




  getPiecesByInterventionId(interventionId: number): Observable<PieceDetachee[]> {
    return this.http.get<PieceDetachee[]>(`${this.apiUrl}/${interventionId}/pieces`);
  }


}
