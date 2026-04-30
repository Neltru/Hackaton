import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RecoverPasswordRequest, StandardResponse } from '../models/auth.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_CONFIG.baseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.saveSession(response)),
      catchError(() => {
        // Mock: determina rol según matrícula cuando la API no está disponible
        const mat = (credentials.matricula || '').toLowerCase();
        let role: 'alumni' | 'company' | 'admin' = 'alumni';
        if (mat.startsWith('admin')) role = 'admin';
        else if (mat.startsWith('emp') || mat.startsWith('empresa')) role = 'company';

        const mockResponse: AuthResponse = {
          token: 'mock-token-' + role,
          role,
          user: { id: '1', email: credentials.matricula, role }
        };
        this.saveSession(mockResponse);
        return of(mockResponse);
      })
    );
  }

  private saveSession(response: AuthResponse): void {
    if (response.token) localStorage.setItem('auth_token', response.token);
    if (response.role) localStorage.setItem('auth_role', response.role);
  }

  getRole(): 'alumni' | 'company' | 'admin' | null {
    return localStorage.getItem('auth_role') as 'alumni' | 'company' | 'admin' | null;
  }

  recoverPassword(data: RecoverPasswordRequest): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(`${this.apiUrl}/recover`, data);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
