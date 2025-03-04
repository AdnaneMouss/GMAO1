import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Batiment} from "../models/batiment";

@Injectable({
  providedIn: 'root'
})
export class BatimentService {

  private apiUrl: string = 'http://localhost:8080/api/locations'; // Directly set the URL

  constructor(private http: HttpClient) { }

  // Get all Batiments with their Etages and Salles
  getAllBatiments(): Observable<Batiment[]> {
    return this.http.get<Batiment[]>(this.apiUrl);
  }

  getEtagesByBatimentId(batId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${batId}/etages`);
  }

  createBatiment(batiment: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, batiment).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
  }

}
