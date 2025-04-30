import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AchatPiece {
  id?: number;
  pieceId: number;
  dateAchat: string; // format 'YYYY-MM-DD'
  quantite: number;
  coutUnitaire: number;
}

@Injectable({
  providedIn: 'root'
})
export class AchatPieceService {

  private apiUrl = 'http://localhost:8080/api/achats';

  constructor(private http: HttpClient) {}

  ajouterAchat(achat: AchatPiece): Observable<any> {
    const params = new HttpParams()
      .set('pieceId', achat.pieceId)
      .set('dateAchat', achat.dateAchat)
      .set('quantite', achat.quantite)
      .set('coutUnitaire', achat.coutUnitaire);

    return this.http.post(this.apiUrl, null, { params });
  }
}
