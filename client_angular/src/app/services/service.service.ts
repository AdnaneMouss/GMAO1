import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getServiceById(serviceId: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${serviceId}`);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createServiceWithImage(serviceData: { nom: string, description: string }, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nom', serviceData.nom);
    formData.append('description', serviceData.description);

    return this.http.post<any>(this.apiUrl, formData);
  }

  /** New Method for Updating a Service */
  updateService(id: number, serviceDTO: { nom: string, description: string }, imageFile: File): Observable<any> {
    const formData = new FormData();

    // Append the service fields to the FormData object
    formData.append('nom', serviceDTO.nom);
    formData.append('description', serviceDTO.description);

    // If there is an image file, append it to the FormData object
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }

    // Perform the PUT request to the backend
    return this.http.put<Service>(`${this.apiUrl}/${id}`, formData);
  }
}
