// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/Fournisseur';

@Injectable({
  providedIn: 'root'
})
export class contratService {
  private apiUrl = 'http://localhost:8080/api/contrats';

  constructor(private http: HttpClient) {}

  ajouterContrat(contrat: any): Observable<any> {
  return this.http.post('http://localhost:8080/api/contrats', contrat);
}

 ajouterContrat1(formData: FormData): Observable<any> {
  return this.http.post('http://localhost:8080/api/contrats/upload', formData);
}

uploadContrat(formData: FormData): Observable<any> {
  return this.http.post('/api/contrats/upload', formData); // adapte l’URL si besoin
}


getContratsByFournisseur(fournisseurId: number): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:8080/api/contrats/fournisseur/${fournisseurId}`);
}


getFournisseurById(id: number): Observable<Fournisseur> {
  return this.http.get<Fournisseur>(`http://localhost:8080/api/fournisseurs/${id}`);
}




 
}
