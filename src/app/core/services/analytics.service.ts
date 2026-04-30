import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GlobalMetrics, AnalyticsFilter } from '../models/analytics.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getGlobalMetrics(filters: AnalyticsFilter): Observable<GlobalMetrics> {
    return this.http.get<GlobalMetrics>(`${API_CONFIG.baseUrl}/admin/reportes/dashboard`);
  }

  getVacantesPublicadas(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}/admin/reportes/vacantes/publicadas`);
  }
}
