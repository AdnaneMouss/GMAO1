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
      fournisseur: string,
      quantiteMinimale: number
    },
    file: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nom', pieceData.nom);
    formData.append('description', pieceData.description);
    formData.append('reference', pieceData.reference);
    formData.append('fournisseur', pieceData.fournisseur);
    formData.append('quantiteMinimale', pieceData.quantiteMinimale.toString());

    return this.http.post<any>(this.apiUrl, formData);
  }

  // Method to update an existing piece detachee with optional image
  updatePiece(pieceId: number, pieceData: {
    nom: string,
    description: string,
    reference: string,
    fournisseur: string,
    coutUnitaire: number,
    quantiteStock: number,
    quantiteMinimale: number,
    dateAchat: string,
    datePeremption: string
  }, imageFile?: File): Observable<any> {

    const formData = new FormData();
    formData.append('nom', pieceData.nom);
    formData.append('description', pieceData.description);
    formData.append('reference', pieceData.reference);
    formData.append('fournisseur', pieceData.fournisseur);
    formData.append('coutUnitaire', pieceData.coutUnitaire.toFixed(2)); // "120.00"

    formData.append('quantiteStock', pieceData.quantiteStock.toString());
    formData.append('quantiteMinimale', pieceData.quantiteMinimale.toString());

    formData.append('dateAchat', new Date(pieceData.dateAchat).toISOString().split('T')[0]);
    formData.append('datePeremption', new Date(pieceData.datePeremption).toISOString().split('T')[0]);

    if (imageFile) {
      formData.append('file', imageFile); // Only append image if it's provided
    }

    return this.http.put<any>(`${this.apiUrl}/${pieceId}`, formData);
  }


  deletePieceDetachee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
