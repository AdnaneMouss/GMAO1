import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  createEtage(etage: Etage): Observable<Etage> {
    return this.http.post<Etage>(this.apiUrl, etage).pipe(
    catchError(error => {
      return throwError(() => error.error);
    })
  );
  }
}
