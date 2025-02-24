import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Equipement} from "../models/equipement";
import {User} from "../models/user";


@Injectable({
  providedIn: 'root'
})
export class EquipementService {

  private apiUrl = 'http://localhost:8080/api/equipements';

  constructor(private http: HttpClient) {}

  createEquipement(equipement: Equipement): Observable<Equipement> {
    return this.http.post<Equipement>(`${this.apiUrl}`, equipement).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getEquipementsByService(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/service/${serviceId}`);
  }

  // Get all equipment
  getAllEquipements(): Observable<Equipement[]> {
    return this.http.get<Equipement[]>(this.apiUrl);
  }

  updateEquipement(id: number, equipement: Equipement): Observable<Equipement> {
    return this.http.put<Equipement>(`${this.apiUrl}/${id}`, equipement);
  }

  getEquipementById(id: number) {
    return this.http.get<Equipement>(`${this.apiUrl}/${id}`);
  }

}
