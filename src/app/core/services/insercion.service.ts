import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { InsercionGlobalStats, InsercionCarrera } from '../models/insercion.models';

@Injectable({
  providedIn: 'root'
})
export class InsercionService {

  private mockGlobalStats: InsercionGlobalStats = {
    totalEgresados: 340,
    contratados: 218,
    porcentajeInsercion: 64
  };

  private mockCarreras: InsercionCarrera[] = [
    { carrera: 'TI', porcentaje: 71 },
    { carrera: 'Administración', porcentaje: 68 },
    { carrera: 'Ing. Civil', porcentaje: 62 },
    { carrera: 'Logística', porcentaje: 58 },
    { carrera: 'Mecatrónica', porcentaje: 74 },
    { carrera: 'Contaduría', porcentaje: 55 }
  ];

  constructor() { }

  getGlobalStats(anio: string, carrera: string): Observable<InsercionGlobalStats> {
    return of(this.mockGlobalStats).pipe(delay(300));
  }

  getInsercionPorCarrera(anio: string): Observable<InsercionCarrera[]> {
    return of(this.mockCarreras).pipe(delay(300));
  }
}
