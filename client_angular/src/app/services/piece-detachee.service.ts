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
  addPiece(pieceDetachee: PieceDetachee): Observable<PieceDetachee> {
    return this.http.post<PieceDetachee>(`${this.apiUrl}/add`, pieceDetachee);
  }

  createPieceDetachee(pieceDetachee: PieceDetachee): Observable<PieceDetachee> {
    return this.http.post<PieceDetachee>(`${this.apiUrl}/add`, pieceDetachee);
  }

  updatePieceDetachee(id: number, pieceDetachee: PieceDetachee): Observable<PieceDetachee> {
      return this.http.put<PieceDetachee>(`${this.apiUrl}/${id}`, pieceDetachee);
    }
  
  deletePieceDetachee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
