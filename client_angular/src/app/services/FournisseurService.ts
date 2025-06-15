import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Fournisseur } from "../models/Fournisseur";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class FournisseurService {
  private apiUrl = 'http://localhost:8080/api/fournisseurs';

  constructor(private http: HttpClient) {}

  addFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, fournisseur);
  }

  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl);
  }

  getAllFournisseursInactifs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiUrl}/inactifs`);
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${id}`);
  }

  updateFournisseur(
    fournisseurId: number,
    fournisseurData: {
      nom: string;
      email: string;
      telephone: string;
      adresse: string;
      codepostal: number | null;
      type: string;
    },
    imageFile?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append('nom', fournisseurData.nom);
    formData.append('email', fournisseurData.email);
    formData.append('telephone', fournisseurData.telephone);
    formData.append('adresse', fournisseurData.adresse);
    formData.append('codepostal', fournisseurData.codepostal?.toString() || '');
    formData.append('type', fournisseurData.type);

    if (imageFile) {
      formData.append('file', imageFile); // Adapter selon le nom attendu côté backend
    }

    return this.http.put<any>(`${this.apiUrl}/${fournisseurId}`, formData);
  }


  deleteFournisseur(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse) {
  let errorMessage = 'Une erreur est survenue';
  if (error.error instanceof ErrorEvent) {
    // Erreur côté client
    errorMessage = `Erreur: ${error.error.message}`;
  } else {
    // Erreur côté serveur
    errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
  }
  console.error(errorMessage);
  return throwError(errorMessage);
}

  archiverFournisseur(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/archiver`, null);
  }

  // ✅ Restaurer un fournisseur
  restaurerFournisseur(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/restaurer`, null);
  }

  // ✅ Archiver plusieurs fournisseurs
  archiverMultipleFournisseurs(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/archiver-multiple`, ids);
  }

  // ✅ Restaurer plusieurs fournisseurs
  restaurerMultipleFournisseurs(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurer-multiple`, ids);
  }

}
