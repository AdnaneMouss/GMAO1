import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AchatPiece {
  id?: number;
  pieceId: number;
  dateAchat: string; // format 'YYYY-MM-DD'
  quantite: number;
  coutUnitaire: number;
  nomPiece?: string;
  referencePiece?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AchatPieceService {

  private apiUrl = 'http://localhost:8080/api/achats';

  constructor(private http: HttpClient) {}

  // Ajouter un achat
  ajouterAchat(achat: AchatPiece): Observable<any> {
    const params = new HttpParams()
      .set('pieceId', achat.pieceId.toString())
      .set('dateAchat', achat.dateAchat)
      .set('quantite', achat.quantite.toString())
      .set('coutUnitaire', achat.coutUnitaire.toString());

    return this.http.post(this.apiUrl, null, { params });
  }

  /** 🔍 Récupérer tous les achats d'une pièce via son ID */
  getAchatsByPieceId(pieceId: number): Observable<AchatPiece[]> {
    return this.http.get<AchatPiece[]>(`${this.apiUrl}/piece/${pieceId}`);
  }

  /** ✍️ Mettre à jour un achat */
  updateAchat(achatId: number, dateAchat: string, quantite: number, coutUnitaire: number): Observable<AchatPiece> {
    const params = new HttpParams()
      .set('achatId', achatId.toString())
      .set('dateAchat', dateAchat)
      .set('quantite', quantite.toString())
      .set('coutUnitaire', coutUnitaire.toString());

    return this.http.put<AchatPiece>(`${this.apiUrl}/update`, null, { params });
  }

  deleteAchat(achatId: number): Observable<any> {
    const params = new HttpParams().set('achatId', achatId.toString());
    return this.http.delete(`${this.apiUrl}/delete`, { params });
  }

}
