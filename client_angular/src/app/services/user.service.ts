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

  createUser(user: User, file: File): Observable<User> {
    const formData = new FormData();

    // Append the user data to the FormData object
    formData.append('nom', user.nom);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('gsm', user.gsm);
    formData.append('role', user.role);
    formData.append('username', user.username);
    formData.append('civilite', user.civilite);

    // Append the file (image) to the FormData object
    formData.append('file', file, file.name); // 'file' is the key expected by the backend

    // Send the request with the form data
    return this.http.post<User>(`${this.apiUrl}/add`, formData);
  }


  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
