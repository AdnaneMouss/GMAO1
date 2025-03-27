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

  createPieceWithImage(pieceData: { nom: string, description: string, reference: string, fournisseur: string, coutUnitaire: number, quantiteStock: number, quantiteMinimale: number, dateAchat: string, datePeremption: string }, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nom', pieceData.nom);
    formData.append('description', pieceData.description);
    formData.append('reference', pieceData.reference);
    formData.append('fournisseur', pieceData.fournisseur);
    formData.append('coutUnitaire', pieceData.coutUnitaire.toString());
    formData.append('quantiteStock', pieceData.quantiteStock.toString());
    formData.append('quantiteMinimale', pieceData.quantiteMinimale.toString());
    formData.append('dateAchat', pieceData.dateAchat);
    formData.append('datePeremption', pieceData.datePeremption);

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
    formData.append('coutUnitaire', pieceData.coutUnitaire.toString());
    formData.append('quantiteStock', pieceData.quantiteStock.toString());
    formData.append('quantiteMinimale', pieceData.quantiteMinimale.toString());

    // Ensure date fields are in "yyyy-MM-dd" format
    formData.append('dateAchat', this.formatDate(pieceData.dateAchat));
    formData.append('datePeremption', this.formatDate(pieceData.datePeremption));

    if (imageFile) {
      formData.append('imageFile', imageFile); // Only append image if it's provided
    }

    return this.http.put<any>(`${this.apiUrl}/${pieceId}`, formData);
  }

// Helper function to format date to "yyyy-MM-dd"
  private formatDate(date: string): string {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  }

  deletePieceDetachee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
