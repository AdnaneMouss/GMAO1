import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Maintenance {
  equipement: string;
  departement: string;
  personneResponsable: string;
  frequence: string;
  dateIntervention: Date;
  dureeEstimee: number;
  uniteDuree: string;
  piecesRechange: string;
  quantitePieces: number;
  localisation: string;
  statut: string;
  imageEquipement:string;
}

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private apiUrl = 'http://localhost:8080/api/maintenances'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}

  getAllMaintenances(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.apiUrl);
  }

  getMaintenanceById(id: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.apiUrl}/${id}`);
  }

  //createMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    //return this.http.post<Maintenance>(this.apiUrl, maintenance);
  //}
  createMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(`${this.apiUrl}/add`, maintenance);
  }
   
  updateMaintenance(id: number, maintenance: Maintenance): Observable<Maintenance> {
    return this.http.put<Maintenance>(`${this.apiUrl}/${id}`, maintenance);
  }

  deleteMaintenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
