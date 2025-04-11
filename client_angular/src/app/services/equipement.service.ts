import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Equipement } from "../models/equipement";
import { User } from "../models/user";
import { AttributEquipements } from "../models/attribut-equipement"; // Tu peux l'enlever si tu ne l'utilises plus pour la méthode getAttributsByEquipement


@Injectable({
  providedIn: 'root'
})
export class EquipementService {

  private apiUrl = 'http://localhost:8080/api/equipements';

  constructor(private http: HttpClient) {}

  createEquipement(equipement: Equipement): Observable<Equipement> {
    console.log("Payload being sent:", JSON.stringify(equipement, null, 2));
    return this.http.post<Equipement>(`${this.apiUrl}/create`, equipement);
  }

  getEquipementsBySalle(salleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bySalle/${salleId}`);
  }

  // Modifié pour renvoyer un Map<string, string> au lieu d'un tableau d'objets AttributEquipements
  getAttributsByEquipement(equipementId: number): Observable<Map<string, string>> {
    return this.http.get<Map<string, string>>(`${this.apiUrl}/${equipementId}/attributs`);
  }

  getPiecesDetacheesByEquipementId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/pieces`);
  }

  getEquipementsByService(serviceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  // Get all equipment
  getAllEquipements(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(this.apiUrl);
  }

  updateEquipement(id: number, equipement: Equipement): Observable<Equipement> {
    return this.http.put<Equipement>(`${this.apiUrl}/${id}`, equipement);
  }

  getEquipementById(id: number): Observable<Equipement> {
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`);
  }
  getAttributsByEquipementId(id: number): Observable<AttributEquipements[]> {
    return this.http.get<AttributEquipements[]>(`${this.apiUrl}/${id}/attributs`);
  }
  

}
