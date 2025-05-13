import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Service} from "../models/service";
import {Salle} from "../models/salle";


@Injectable({
  providedIn: 'root'
})
export class SalleService {

  private apiUrl: string = 'http://localhost:8080/api/salle'; // Update the URL to match the endpoint

  constructor(private http: HttpClient) { }


  createSalle(salle: any): Observable<any> {
    const params = new HttpParams()
      .set('num', salle.num)
      .set('prefixe', salle.prefixe)
      .set('etageId', salle.etageId);

    return this.http.post<any>(this.apiUrl, null, { params }).pipe(
      catchError(error => throwError(() => error.error))
    );
  }

  getSalleById(salleId: string): Observable<Salle> {
    return this.http.get<Salle>(`${this.apiUrl}/${salleId}`);
  }


  // Update Salle (send full object in body)
  updateSalle(id: number, salle: any): Observable<any> {
    const params = new HttpParams()
      .set('num', salle.num)
      .set('prefixe', salle.prefixe)
      .set('etageId', salle.etageId);
    return this.http.put<any>(`${this.apiUrl}/${id}`, null, { params }).pipe(
      catchError(error => throwError(() => error.error))
    );
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
