import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  private apiUrl = 'http://localhost:8080/api/password';

  constructor(private http: HttpClient) {}


  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-code`, email);
  }

  // Verify the code and change password
  verifyCodeAndChangePassword(email: string, code: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('code', code)
      .set('newPassword', newPassword);

    return this.http.post(`${this.apiUrl}/verify-code`, null, { params });
  }

}
