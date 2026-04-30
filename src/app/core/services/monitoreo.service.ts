import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MonitoreoStats, MonitoreoPromedioCarrera, HistogramaDataPoint } from '../models/monitoreo.models';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {

  private mockStats: MonitoreoStats = {
    promedioGlobal: 72.4,
    puntajeMin: 41,
    puntajeMax: 98,
    desviacionEstandar: 11.2
  };

  private mockPromedios: MonitoreoPromedioCarrera[] = [
    { carrera: 'Tecnologías de la Información', psicometrica: 74, cognitiva: 78, tecnica: 81, proyectiva: 70 },
    { carrera: 'Administración', psicometrica: 71, cognitiva: 68, tecnica: null, proyectiva: 73 },
    { carrera: 'Ing. Civil', psicometrica: 69, cognitiva: 72, tecnica: 76, proyectiva: 65 }
  ];

  // Mocking the normal distribution points (10 bins for example)
  private mockHistograma: HistogramaDataPoint[] = [
    { rango: '40-45', frecuencia: 2, gaussCurva: 5 },
    { rango: '46-51', frecuencia: 5, gaussCurva: 10 },
    { rango: '52-57', frecuencia: 15, gaussCurva: 22 },
    { rango: '58-63', frecuencia: 35, gaussCurva: 40 },
    { rango: '64-69', frecuencia: 58, gaussCurva: 65 },
    { rango: '70-75', frecuencia: 75, gaussCurva: 80 },
    { rango: '76-81', frecuencia: 60, gaussCurva: 65 },
    { rango: '82-87', frecuencia: 38, gaussCurva: 40 },
    { rango: '88-93', frecuencia: 18, gaussCurva: 22 },
    { rango: '94-100', frecuencia: 6, gaussCurva: 10 },
  ];

  constructor() { }

  getStats(carreraFiltro: string, anioFiltro: string): Observable<MonitoreoStats> {
    return of(this.mockStats).pipe(delay(300));
  }

  getPromedios(carreraFiltro: string, anioFiltro: string): Observable<MonitoreoPromedioCarrera[]> {
    return of(this.mockPromedios).pipe(delay(300));
  }

  getHistograma(carreraFiltro: string, anioFiltro: string): Observable<HistogramaDataPoint[]> {
    return of(this.mockHistograma).pipe(delay(300));
  }
}
