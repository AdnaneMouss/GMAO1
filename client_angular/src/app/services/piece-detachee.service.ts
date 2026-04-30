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

  createPieceWithImage(
    pieceData: {
      nom: string,
      description: string,
      reference: string,
      fournisseurId: number,
      quantiteMinimale: number
    },
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nom', pieceData.nom);
    formData.append('description', pieceData.description);
    formData.append('reference', pieceData.reference);
    formData.append('fournisseurId', pieceData.fournisseurId.toString());
    formData.append('quantiteMinimale', pieceData.quantiteMinimale.toString());

    return this.http.post<any>(this.apiUrl, formData);
  }

  // Method to update an existing piece detachee with optional image
  updatePiece(
    pieceId: number,
    pieceData: {
      nom: string,
      description: string,
      reference: string,
      fournisseurId: number,
      quantiteMinimale: number
    },
    imageFile?: File
  ): Observable<any> {

    const formData = new FormData();

    if (imageFile) {
      formData.append('file', imageFile);
    }

    formData.append('nom', pieceData.nom);
    formData.append('description', pieceData.description);
    formData.append('reference', pieceData.reference);
    formData.append('fournisseurId', pieceData.fournisseurId.toString());
    formData.append('quantiteMinimale', pieceData.quantiteMinimale.toString());

    return this.http.put<any>(`${this.apiUrl}/${pieceId}`, formData);
  }

  deletePieceDetachee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
