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

  getTypesEquipements(): Observable<TypesEquipements[]> {
    return this.http.get<TypesEquipements[]>(this.apiUrl);
  }
  getAttributesByTypeId(typeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${typeId}/attributes`);
  }

  createType(type: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, type).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
  }


}
