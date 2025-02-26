import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoutMaintenance } from '../models/cout-maintenance';

@Injectable({
  providedIn: 'root'
})
export class CoutMaintenanceService {
  private apiUrl = 'http://localhost:8080/api/couts-maintenance';

  constructor(private http: HttpClient) {}

  getAllCoutsMaintenance(): Observable<CoutMaintenance[]> {
    return this.http.get<CoutMaintenance[]>(this.apiUrl);
  }

  createCoutMaintenance(coutMaintenance: CoutMaintenance): Observable<CoutMaintenance> {
    return this.http.post<CoutMaintenance>(this.apiUrl, coutMaintenance);
  }

  deleteCoutMaintenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
