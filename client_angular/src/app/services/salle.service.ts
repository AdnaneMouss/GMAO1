import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Salle} from "../models/salle";

@Injectable({
  providedIn: 'root'
})
export class SalleService {

  private apiUrl: string = 'http://localhost:8080/api/salle'; // Update the URL to match the endpoint

  constructor(private http: HttpClient) { }


  createSalle(salle: Salle): Observable<Salle> {
    return this.http.post<Salle>(this.apiUrl, salle).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
  }
}
