import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PieceDetachee } from '../models/piece-detachee';

@Injectable({
  providedIn: 'root'
})
export class PieceDetacheeService {
  private apiUrl = 'http://localhost:8080/api/pieces-detachees';

  constructor(private http: HttpClient) {}

  getAllPiecesDetachees(): Observable<PieceDetachee[]> {
    return this.http.get<PieceDetachee[]>(this.apiUrl);
  }

  getPieceDetacheeById(id: number): Observable<PieceDetachee> {
    return this.http.get<PieceDetachee>(`${this.apiUrl}/${id}`);
  }

  createPieceDetachee(pieceDetachee: PieceDetachee): Observable<PieceDetachee> {
    return this.http.post<PieceDetachee>(this.apiUrl, pieceDetachee);
  }

  deletePieceDetachee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
