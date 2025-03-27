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

  getInterventionsByTechnician(technicianId: number): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/technicien/${technicianId}`);
  }

  // Updated createIntervention method to handle file upload
  createIntervention(interventionData: { description: string, remarques: string, maintenanceId: number, technicienId: number }, file: File): Observable<Intervention> {
    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data
    formData.append('description', interventionData.description);
    formData.append('remarques', interventionData.remarques);
    formData.append('maintenanceId', interventionData.maintenanceId.toString()); // Append the maintenanceId
    formData.append('technicienId', interventionData.technicienId.toString()); // Append the technician's ID

    return this.http.post<Intervention>(`${this.apiUrl}/create`, formData);
  }
}
