import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Convenio, ConveniosStats, EmpresaPendiente, EmpresaPorVencer, ReporteConveniosStats, MapaRegion, MapaStats } from '../models/convenios.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ConveniosService {

  private apiUrl = `${API_CONFIG.baseUrl}/admin`;

  constructor(private http: HttpClient) { }

  getConvenios(): Observable<Convenio[]> {
    return this.http.get<any>(`${this.apiUrl}/convenios`).pipe(
      map(data => data.convenios || data || [])
    );
  }

  getListaConvenios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/convenios`);
  }

  getStats(): Observable<ConveniosStats> {
    return this.http.get<any>(`${this.apiUrl}/reportes/convenios`).pipe(
      map(data => {
        if (data.stats) return data.stats;
        return {
          activos: data.activos || 0,
          pendientes: data.pendientes || 0,
          porVencer: data.porVencer || 0
        };
      })
    );
  }

  getReporteStats(): Observable<ReporteConveniosStats> {
    return this.http.get<any>(`${this.apiUrl}/reportes/convenios`).pipe(
      map(data => {
        if (data.reporteStats) return data.reporteStats;
        return {
          activas: data.activas || 0,
          proximosVencer: data.proximosVencer || 0,
          pendientesFormalizacion: data.pendientesFormalizacion || 0
        };
      })
    );
  }

  getEmpresasPendientes(): Observable<EmpresaPendiente[]> {
    return this.http.get<any>(`${this.apiUrl}/reportes/convenios`).pipe(
      map(data => data.empresasPendientes || [])
    );
  }

  getEmpresasPorVencer(): Observable<EmpresaPorVencer[]> {
    return this.http.get<any>(`${this.apiUrl}/reportes/convenios`).pipe(
      map(data => data.empresasPorVencer || [])
    );
  }

  getMapaStats(): Observable<MapaStats> {
    return this.http.get<any>(`${this.apiUrl}/reportes/cobertura`).pipe(
      map(data => {
        if (data.mapaStats) return data.mapaStats;
        return {
          zonaNorte: data.zonaNorte || 0,
          nacional: data.nacional || 0
        };
      })
    );
  }

  getMapaRegiones(filtro: string): Observable<MapaRegion[]> {
    return this.http.get<any>(`${this.apiUrl}/reportes/cobertura`).pipe(
      map(data => data.regiones || data || [])
    );
  }

  darDeAltaEmpresa(empresaId: string | number): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresa/alta`, { empresa_id: empresaId });
  }
}
