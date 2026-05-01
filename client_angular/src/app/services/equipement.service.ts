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

  createEquipementWithImage(
    equipementData: {
      nom: string;
      description: string;
      numeroSerie: string;
      modele: string;
      marque: string;
      dateAchat: string; // yyyy-MM-dd
      garantie: string;
      coutAchat: number;
      typeEquipementNom: string;
      serviceNom?: string;
      batimentNom?: string;
      etageNum?: number;
      salleNum?: number;
      attributsValeurs?: { [attributId: number]: string };
    },
    file?: File
  ): Observable<any> {
    const formData = new FormData();

    // Append file if exists
    if (file) {
      formData.append('file', file);
    }

    // Required fields
    formData.append('nom', equipementData.nom);
    formData.append('description', equipementData.description);
    formData.append('numeroSerie', equipementData.numeroSerie);
    formData.append('modele', equipementData.modele);
    formData.append('marque', equipementData.marque);
    formData.append('dateAchat', equipementData.dateAchat);
    formData.append('garantie', equipementData.garantie);
    formData.append('coutAchat', equipementData.coutAchat.toString());
    formData.append('typeEquipementNom', equipementData.typeEquipementNom);

    // Optional fields
    if (equipementData.serviceNom) {
      formData.append('serviceNom', equipementData.serviceNom);
    }
    if (equipementData.batimentNom) {
      formData.append('batimentNom', equipementData.batimentNom);
    }
    if (equipementData.etageNum !== undefined) {
      formData.append('etageNum', equipementData.etageNum.toString());
    }
    if (equipementData.salleNum !== undefined) {
      formData.append('salleNum', equipementData.salleNum.toString());
    }

    // attributsValeurs JSON stringified
    if (equipementData.attributsValeurs) {
      formData.append('attributsValeurs', JSON.stringify(equipementData.attributsValeurs));
    }

    return this.http.post<any>(`${this.apiUrl}/create`, formData);
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
