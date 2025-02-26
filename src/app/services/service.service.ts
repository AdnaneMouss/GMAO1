import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { Service } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8080/api/services';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  getServiceById(serviceId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${serviceId}`);
  }

  createService(service: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, service).pipe(
      catchError(error => {
        return throwError(() => error.error);
      })
    );
  }


  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
