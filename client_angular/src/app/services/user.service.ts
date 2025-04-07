import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUserWithImage(userData: { nom: string, email?: string, username?: string, password?: string, gsm?: string, civilite?: string, role?: string }, file?: File): Observable<any> {
    const formData = new FormData();

    // Append 'file' if provided
    if (file) {
      formData.append('file', file);
    }

    // Append 'nom' (required)
    formData.append('nom', userData.nom);

    // Append optional fields only if they exist
    if (userData.email) {
      formData.append('email', userData.email);
    }
    if (userData.username) {
      formData.append('username', userData.username);
    }
    if (userData.password) {
      formData.append('password', userData.password);
    }
    if (userData.gsm) {
      formData.append('gsm', userData.gsm);
    }
    if (userData.civilite) {
      formData.append('civilite', userData.civilite);
    }
    if (userData.role) {
      formData.append('role', userData.role);
    }

    // Send the form data in a POST request
    return this.http.post<any>(this.apiUrl, formData);
  }


  updateUser(userId: number, userData: { nom: string, email: string, gsm: string, role: string, username: string, civilite: string, actif: boolean }, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('nom', userData.nom);
    formData.append('email', userData.email);
    formData.append('gsm', userData.gsm);
    formData.append('role', userData.role);
    formData.append('username', userData.username);
    formData.append('civilite', userData.civilite);
    formData.append('actif', userData.actif.toString());  // Convert boolean to string for the form data

    if (imageFile) {
      formData.append('imageFile', imageFile); // Only append image if it's provided
    }

    return this.http.put<any>(`${this.apiUrl}/${userId}`, formData);
  }



}
