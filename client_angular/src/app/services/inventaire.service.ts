import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventaire } from "../models/inventaire";

@Injectable({
  providedIn: 'root'
})
export class InventaireService {
  private apiUrl = 'http://localhost:8080/api/inventaires';

  constructor(private http: HttpClient) {}

  addInventaire(inventaire: Inventaire): Observable<Inventaire> {
    return this.http.post<Inventaire>(this.apiUrl, inventaire);
  }

  getAllInventaires(): Observable<Inventaire[]> {
    return this.http.get<Inventaire[]>(this.apiUrl);
  }

  corrigerStock(inventaireId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${inventaireId}/corriger-stock`, {});
  }



  updateInventaire(id: number, inventaire: Inventaire): Observable<Inventaire> {
    return this.http.put<Inventaire>(`${this.apiUrl}/${id}`, inventaire);
  }
}
