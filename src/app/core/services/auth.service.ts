import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RecoverPasswordRequest, StandardResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update this URL with your real API endpoint
  private apiUrl = 'https://api.hackaton-project.com/auth'; 

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
      })
    );
  }

  recoverPassword(data: RecoverPasswordRequest): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(`${this.apiUrl}/recover`, data);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
