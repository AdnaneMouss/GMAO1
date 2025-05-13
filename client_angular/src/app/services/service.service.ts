import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service';
import {Batiment} from "../models/batiment";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:8080/api/services';

  constructor(private http: HttpClient) {}

  getAllServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  // ✅ Get only inactive (archived) Batiments
  getServicesInactifs(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}/inactifs`);
  }

  getServiceById(serviceId: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${serviceId}`);
  }

  createServiceWithImage(serviceData: { nom: string, description?: string }, file?: File): Observable<any> {
    const formData = new FormData();

    // Append 'nom' (required)
    formData.append('nom', serviceData.nom);

    // Append 'description' only if it exists
    if (serviceData.description) {
      formData.append('description', serviceData.description);
    }

    // Append the file only if it is provided
    if (file) {
      formData.append('file', file);
    }

    return this.http.post<any>(this.apiUrl, formData);
  }

  // New method to update service
  updateService(serviceId: number, serviceData: { nom: string, description: string }, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', serviceData.nom);
    formData.append('description', serviceData.description);

    if (imageFile) {
      formData.append('imageFile', imageFile); // Only append image if it's provided
    }

    return this.http.put<any>(`${this.apiUrl}/${serviceId}`, formData);
  }

  archiverService(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/archiver`, null);
  }

  // ✅ Restore a Batiment
  restaurerService(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/restaurer`, null);
  }

  restaurerMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurer-multiple`, ids);
  }

  archiverMultiple(ids: number[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/archiver-multiple`, ids);
  }
}
