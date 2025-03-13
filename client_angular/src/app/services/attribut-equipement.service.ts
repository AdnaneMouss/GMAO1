import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { AttributEquipements } from '../models/attribut-equipement';  // Import the DTO model

@Injectable({
  providedIn: 'root',
})
export class AttributEquipementService {

  private apiUrl = 'http://localhost:8080/api/attributs-equipements';

  constructor(private http: HttpClient) {}

  createAttributEquipement(attrDTO: AttributEquipements): Observable<AttributEquipements> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<AttributEquipements>(this.apiUrl, attrDTO, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
    }


  updateAttributEquipement(id: number, attrDTO: AttributEquipements): Observable<AttributEquipements> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put<AttributEquipements>(`${this.apiUrl}/${id}`, attrDTO, { headers }).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
  }

}
