import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResultadoPrueba } from '../models/evaluaciones.models';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionesService {
  private apiUrl = 'https://api.hackaton-project.com';

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
      catchError(() => {
        // Datos mock para desarrollo hasta que el backend esté listo
        return of(this.getMockResultados());
      })
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

  /** Datos mock para desarrollo */
  private getMockResultados(): ResultadoPrueba {
    return {
      resultado_id: 1,
      alumno_id: 42,
      puntaje_psicometrico: 82,
      puntaje_cognitivo: 74,
      puntaje_tecnico: 91,
      puntaje_proyectivo: null,
      psicometrico_completado_at: '2026-04-10T14:30:00Z',
      cognitivo_completado_at: '2026-04-12T10:15:00Z',
      tecnico_completado_at: '2026-04-14T16:45:00Z',
      proyectivo_completado_at: null
    };
  }
}
