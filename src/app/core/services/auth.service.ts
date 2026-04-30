import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { 
  AuthResponse, 
  LoginRequest, 
  RecoverPasswordRequest, 
  StandardResponse,
  Verify2faRequest,
  RegisterEgresadoRequest,
  RegisterEmpresaRequest,
  ResetPasswordRequest
} from '../models/auth.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${API_CONFIG.baseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si no requiere 2FA (token presente), guardamos sesión
        if (response.token) {
          this.saveSession(response);
        }
      })
    );
  }

  verify2fa(data: Verify2faRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-2fa`, data).pipe(
      tap(response => this.saveSession(response))
    );
  }

  registerEgresado(data: RegisterEgresadoRequest): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(`${this.apiUrl}/register-egresado`, data);
  }

  registerEmpresa(data: RegisterEmpresaRequest): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(`${this.apiUrl}/register-empresa`, data);
  }

  recoverPassword(data: RecoverPasswordRequest): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(`${this.apiUrl}/recover-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<StandardResponse> {
    return this.http.post<StandardResponse>(`${this.apiUrl}/reset-password`, data);
  }

  private saveSession(response: AuthResponse): void {
    if (response.token) localStorage.setItem('auth_token', response.token);
    if (response.role) localStorage.setItem('auth_role', response.role.toString());
  }

  getRole(): string | null {
    return localStorage.getItem('auth_role');
  }

  logout(): Observable<StandardResponse> {
    const token = localStorage.getItem('auth_token');
    return this.http.post<StandardResponse>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.clearSession()),
      catchError(() => {
        this.clearSession();
        return of({ success: true, message: 'Sesión cerrada localmente' });
      })
    );
  }

  private clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
