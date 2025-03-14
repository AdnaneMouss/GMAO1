import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { maintenance } from '../models/maintenance';


@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private apiUrl = 'http://localhost:8080/api/maintenances'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}

  getAllMaintenances(): Observable<maintenance[]> {
    return this.http.get<maintenance[]>(this.apiUrl);
  }
  getMaintenanceById(id: number): Observable<maintenance> {
    return this.http.get<maintenance>(`${this.apiUrl}/${id}`);
  }

  //createMaintenance(maintenance: Maintenance): Observable<Maintenance> {
    //return this.http.post<Maintenance>(this.apiUrl, maintenance);
  //}
  createMaintenance(maintenance: maintenance): Observable<maintenance> {
    return this.http.post<maintenance>(`${this.apiUrl}/add`, maintenance);
   }
 // createMaintenance(maintenance: FormData): Observable<any> {
   // return this.http.post(`${this.apiUrl}/add`, maintenance);
  //}

  
   
  updateMaintenance(id: number, maintenance: maintenance): Observable<maintenance> {
    return this.http.put<maintenance>(`${this.apiUrl}/${id}`, maintenance);
  }
  
  
  

  deleteMaintenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getFilteredMaintenances(filters: { priority: string, status: string }): Observable<any> {
    const params = new HttpParams()
      .set('priority', filters.priority)
      .set('status', filters.status);
  
    return this.http.get<any>('/api/maintenancePeriodique', { params });
  }
  
}
