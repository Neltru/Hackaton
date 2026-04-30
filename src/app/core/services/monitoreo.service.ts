import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MonitoreoStats, MonitoreoPromedioCarrera, HistogramaDataPoint } from '../models/monitoreo.models';
import { API_CONFIG } from '../constants/api.constants';
import {
  MOCK_MONITOREO_STATS,
  MOCK_PROMEDIOS_CARRERA,
  MOCK_HISTOGRAMA
} from '../mocks/alumni-mock.data';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  private apiUrl = `${API_CONFIG.baseUrl}/admin/reportes/monitoreo-sot`;

  constructor(private http: HttpClient) { }

  getStats(carreraFiltro: string, anioFiltro: string): Observable<MonitoreoStats> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.stats || data),
      catchError(() => of(MOCK_MONITOREO_STATS))
    );
  }

  getPromedios(carreraFiltro: string, anioFiltro: string): Observable<MonitoreoPromedioCarrera[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.promedios || []),
      catchError(() => of(MOCK_PROMEDIOS_CARRERA))
    );
  }

  getHistograma(carreraFiltro: string, anioFiltro: string): Observable<HistogramaDataPoint[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.histograma || []),
      catchError(() => of(MOCK_HISTOGRAMA))
    );
  }
}

