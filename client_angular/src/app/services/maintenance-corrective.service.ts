import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceCorrective } from '../models/maintenance-corrective';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceCorrectiveService {
  private apiUrl = 'http://localhost:8080/api/maintenance-corrective'; // L'URL de base

  constructor(private http: HttpClient) {}

  // Fetch all maintenances
  getAllMaintenances(): Observable<MaintenanceCorrective[]> {
    return this.http.get<MaintenanceCorrective[]>(this.apiUrl);
  }

  // Fetch maintenances by technician ID
  getMaintenancesByTechnicien(technicienId: number): Observable<MaintenanceCorrective[]> {
    return this.http.get<MaintenanceCorrective[]>(`${this.apiUrl}/${technicienId}`);
  }

  // Create a new maintenance
  createMaintenance(maintenance: MaintenanceCorrective): Observable<MaintenanceCorrective> {
    return this.http.post<MaintenanceCorrective>(`${this.apiUrl}/add`, maintenance);
  }

  requestMaintenance(maintenance: MaintenanceCorrective): Observable<MaintenanceCorrective> {
    return this.http.post<MaintenanceCorrective>(`${this.apiUrl}/request`, maintenance);
  }

  // Start a maintenance task
  startTask(id: number): Observable<MaintenanceCorrective> {
    return this.http.put<MaintenanceCorrective>(`${this.apiUrl}/${id}/start`, {});
  }

  cancelTask(id: number): Observable<MaintenanceCorrective> {
    return this.http.put<MaintenanceCorrective>(`${this.apiUrl}/${id}/cancel`, {});
  }

  approveRequest(id: number, requestDTO: Partial<MaintenanceCorrective>): Observable<MaintenanceCorrective> {
    return this.http.put<MaintenanceCorrective>(`${this.apiUrl}/${id}/approveRequest`, requestDTO);
  }

  // Mark a maintenance task as completed
  markAsCompleted(id: number): Observable<MaintenanceCorrective> {
    return this.http.put<MaintenanceCorrective>(`${this.apiUrl}/${id}/complete`, {});
  }

  getTechnicianWorkload(technicianId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/technician/workload/${technicianId}`);
  }

  updateMaintenanceCorrective(maintenanceId: number, maintenance: MaintenanceCorrective): Observable<MaintenanceCorrective> {
    return this.http.put<MaintenanceCorrective>(`${this.apiUrl}/${maintenanceId}`, maintenance);
  }

  updateMaintenanceCorrectiveLambda(maintenanceId: number, maintenance: MaintenanceCorrective): Observable<MaintenanceCorrective> {
    return this.http.put<MaintenanceCorrective>(`${this.apiUrl}/${maintenanceId}/updateRequest`, maintenance);
  }
}
