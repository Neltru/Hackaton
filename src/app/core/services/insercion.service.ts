import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InsercionGlobalStats, InsercionCarrera } from '../models/insercion.models';
import { API_CONFIG } from '../constants/api.constants';
import { MOCK_INSERCION_STATS, MOCK_INSERCION_POR_CARRERA } from '../mocks/alumni-mock.data';

@Injectable({
  providedIn: 'root'
})
export class InsercionService {

  private apiUrl = `${API_CONFIG.baseUrl}/admin/reportes/insercion`;

  constructor(private http: HttpClient) { }

  getGlobalStats(anio: string, carrera: string): Observable<InsercionGlobalStats> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        let totalEgresados = 0;
        let contratados = 0;

        if (Array.isArray(data)) {
           data.forEach(item => {
             totalEgresados += parseInt(item.total_registrados || '0');
             contratados += parseInt(item.contratados || '0');
           });
        } else if (data && (data as any).global) {
           return (data as any).global;
        }

        const porcentajeInsercion = totalEgresados > 0 ? Math.round((contratados / totalEgresados) * 100) : 0;

        return { totalEgresados, contratados, porcentajeInsercion };
      }),
      catchError(() => of(MOCK_INSERCION_STATS))
    );
  }

  getInsercionPorCarrera(anio: string): Observable<InsercionCarrera[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        if (Array.isArray(data)) {
           return data.map(item => ({
             carrera: item.carrera,
             porcentaje: parseFloat(item.porcentaje_insercion || '0')
           }));
        } else if (data && (data as any).carreras) {
           return (data as any).carreras;
        }
        return [];
      }),
      catchError(() => of(MOCK_INSERCION_POR_CARRERA))
    );
  }
}

