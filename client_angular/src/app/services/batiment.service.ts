import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Batiment } from "../models/batiment";

@Injectable({
  providedIn: 'root'
})
export class BatimentService {

  private apiUrl: string = 'http://localhost:8080/api/locations';

  constructor(private http: HttpClient) {}

  // ✅ Get all Batiments actifs
  getAllBatiments(): Observable<Batiment[]> {
    return this.http.get<Batiment[]>(this.apiUrl);
  }

  // ✅ Get Etages by Batiment ID
  getEtagesByBatimentId(batId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${batId}/etages`);
  }

  // Get inactive Etages by Batiment ID
  getEtagesInactifsByBatimentId(batId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${batId}/etages/inactifs`);
  }
  // ✅ Create a new Batiment
  createBatiment(batiment: any): Observable<any> {
    const params = new HttpParams()
      .set('intitule', batiment.intitule)
      .set('numBatiment', batiment.numBatiment);

    return this.http.post<any>(this.apiUrl, null, { params }).pipe(
      catchError(error => throwError(() => error.error))
    );
  }

  updateBatiment(id: number, batiment: any): Observable<any> {
    const params = new HttpParams()
      .set('intitule', batiment.intitule)
      .set('numBatiment', batiment.numBatiment)
      .set('actif', batiment.actif);

    return this.http.put<any>(`${this.apiUrl}/${id}`, null, { params }).pipe(
      catchError(error => throwError(() => error.error))
    );
  }



  // ✅ Get a Batiment by ID
  getBatimentById(id: number): Observable<Batiment> {
    return this.http.get<Batiment>(`${this.apiUrl}/${id}`);
  }


  // ✅ Get only inactive (archived) Batiments
  getBatimentsInactifs(): Observable<Batiment[]> {
    return this.http.get<Batiment[]>(`${this.apiUrl}/inactifs`);
  }

  // ✅ Archive a Batiment
  archiverBatiment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/archiver`, null);
  }

  // ✅ Restore a Batiment
  restaurerBatiment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/restaurer`, null);
  }

  restaurerMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurer-multiple`, ids);
  }

  archiverMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/archiver-multiple`, ids);
  }


}
