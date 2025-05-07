import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Etage} from "../models/etage";


@Injectable({
  providedIn: 'root'
})
export class EtageService {

  private apiUrl: string = 'http://localhost:8080/api/etage'; // Update the URL to match the endpoint

  constructor(private http: HttpClient) { }


  getSallesByEtageId(etageId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${etageId}/salles`);
  }


// Create Etage (using query params)
  createEtage(etage: any): Observable<any> {
    const params = new HttpParams()
      .set('num', etage.num)
      .set('batimentId', etage.batimentId);

    return this.http.post<any>(this.apiUrl, null, { params }).pipe(
      catchError(error => throwError(() => error.error))
    );
  }

  // Update Etage (send full object in body)
  updateEtage(id: number, etage: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, etage).pipe(
      catchError(error => throwError(() => error.error))
    );
  }


  getEtageById(id: number): Observable<Etage[]> {
    return this.http.get<Etage[]>(`${this.apiUrl}/${id}`);
  }

  archiver(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/archiver`, {});
  }


  restaurer(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/restaurer`, {});
  }

  restaurerMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurer-multiple`, ids);
  }

  archiverMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/archiver-multiple`, ids);
  }


}
