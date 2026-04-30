import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { GlobalMetrics, AnalyticsFilter } from '../models/analytics.models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  getGlobalMetrics(filters: AnalyticsFilter): Observable<GlobalMetrics> {
    // Simulate real-time data calculation based on filters
    console.log('Calculating analytics with filters:', filters);
    
    // Variance based on filters to simulate "real-time" change
    const factor = filters.carrera === 'Todas' ? 1 : 0.8;
    const zonaFactor = filters.zona === 'Nayarit' ? 1.2 : 1;

    const mockData: GlobalMetrics = {
      insercion: Math.round(65 * factor * zonaFactor),
      conveniosActivos: Math.round(48 * factor),
      promedioEvaluacion: 72.4,
      totalAlumnos: filters.carrera === 'Todas' ? 1200 : 340,
      distribucionCarreras: [
        { label: 'TI', valor: 45 },
        { label: 'ADM', valor: 30 },
        { label: 'CIV', valor: 25 }
      ],
      tendenciaHistorica: [
        { label: 'Ene', valor: 40 },
        { label: 'Feb', valor: 45 },
        { label: 'Mar', valor: 55 },
        { label: 'Abr', valor: Math.round(64 * factor) }
      ]
    };

    return of(mockData).pipe(delay(400));
  }
}
