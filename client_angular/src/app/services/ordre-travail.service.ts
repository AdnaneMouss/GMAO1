import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrdreTravail } from '../models/ordre-travail';

@Injectable({
  providedIn: 'root'
})
export class OrdreTravailService {
  private apiUrl = 'http://localhost:8080/api/ordres-travail';

  constructor(private http: HttpClient) {}

  getAllOrdresTravail(): Observable<OrdreTravail[]> {
    return this.http.get<OrdreTravail[]>(this.apiUrl);
  }

  createOrdreTravail(ordreTravail: OrdreTravail): Observable<OrdreTravail> {
    return this.http.post<OrdreTravail>(this.apiUrl, ordreTravail);
  }

  deleteOrdreTravail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
