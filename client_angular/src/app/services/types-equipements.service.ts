import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TypesEquipements } from '../models/types-equipements';
import {catchError, Observable, throwError} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TypesEquipementsService {

  private apiUrl = 'http://localhost:8080/api/types-equipements';

  constructor(private http: HttpClient) { }

  getActifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getInactifs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/inactifs`);
  }

  getAttributesByTypeId(typeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${typeId}/attributes`);
  }

  createType(type: { type: string; file: File }): Observable<any> {
    const formData = new FormData();
    formData.append('type', type.type);
    formData.append('file', type.file); // Attach the image file

    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
  }

  updateType(typeId: number, typeEquipementData: { type: string}, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('type', typeEquipementData.type);

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    return this.http.put<any>(`${this.apiUrl}/${typeId}`, formData);
  }

  archiver(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/archiver`, {});
  }


  restaurer(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/restaurer`, {});
  }

  restaurerMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurer-multiple`, ids);
  }

  archiverMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/archiver-multiple`, ids);
  }


}
