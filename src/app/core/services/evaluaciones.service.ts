import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResultadoPrueba } from '../models/evaluaciones.models';
import { API_CONFIG } from '../constants/api.constants';
import { MOCK_RESULTADO_PRUEBA } from '../mocks/alumni-mock.data';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionesService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** Obtiene los resultados de pruebas del alumno autenticado */
  getMisResultados(): Observable<ResultadoPrueba> {
    return this.http.get<ResultadoPrueba>(
      `${this.apiUrl}/evaluaciones/mis-resultados`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(() => of(MOCK_RESULTADO_PRUEBA))
    );
  }

  /** Inicia una prueba (devuelve URL o token de acceso) */
  iniciarPrueba(tipoPrueba: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(
      `${this.apiUrl}/evaluaciones/iniciar`,
      { tipo: tipoPrueba },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(() => of({ url: '#' }))
    );
  }

  /** Obtiene listado de evaluaciones para el administrador */
  getAdminEvaluaciones(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/admin/evaluaciones`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(() => of([]))
    );
  }
}

