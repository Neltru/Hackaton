import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MonitoreoStats, MonitoreoPromedioCarrera, HistogramaDataPoint } from '../models/monitoreo.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  private apiUrl = `${API_CONFIG.baseUrl}/admin/reportes/monitoreo-sot`;

  constructor(private http: HttpClient) { }

  getStats(carreraFiltro: string, anioFiltro: string): Observable<MonitoreoStats> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.stats || data)
    );
  }

  getPromedios(carreraFiltro: string, anioFiltro: string): Observable<MonitoreoPromedioCarrera[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.promedios || [])
    );
  }

  getHistograma(carreraFiltro: string, anioFiltro: string): Observable<HistogramaDataPoint[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => data.histograma || [])
    );
  }
}
