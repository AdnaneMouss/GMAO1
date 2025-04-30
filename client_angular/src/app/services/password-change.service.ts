import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private baseUrl = 'http://localhost:8080/api/password'; // or your deployed backend URL

  constructor(private http: HttpClient) {
  }

  // Send verification code to the user's email
  sendVerificationCode(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    // Ensure that the backend returns plain text (you may adjust this based on your backend)
    return this.http.post(`${this.baseUrl}/send-code`, null, {params, responseType: 'text'});
  }

  verifyCodeAndChangePassword(
    email: string,
    code: string,
    currentPassword: string,
    newPassword: string
  ): Observable<string> {
    const requestBody = {
      email,
      code,
      currentPassword,
      newPassword
    };

    return this.http.post<any>(`${this.baseUrl}/verify-and-update`, requestBody, {
      responseType: 'text' as 'json' // 👈 force Angular to treat it like JSON
    });
  }

  checkCurrentPassword(currentPassword: string, email: string): Observable<string> {
    const params = new HttpParams()
      .set('currentPassword', currentPassword)
      .set('email', email);

    return this.http.post<string>(`${this.baseUrl}/check-password`, null, { params, responseType: 'text' as 'json' });
  }

  verifyCode(email: string, code: string): Observable<string> {
    const params = new HttpParams()
      .set('email', email)
      .set('code', code);

    return this.http.post<string>(`${this.baseUrl}/verify-code`, null, {
      params,
      responseType: 'text' as 'json'
    });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<string> {
    const params = new HttpParams()
      .set('email', email)
      .set('code', code)
      .set('newPassword', newPassword);

    return this.http.post<string>(`${this.baseUrl}/reset-password`, null, {
      params,
      responseType: 'text' as 'json'
    });
  }

}
