import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AlumnoPuntajes, BateriaPuntajes, EmpresaBenchmark } from '../models/pruebas-sot.models';

@Injectable({
  providedIn: 'root'
})
export class PruebasSotService {

  // Single Source of Truth for Student Scores
  private dbAlumnos: AlumnoPuntajes[] = [
    {
      alumnoId: 'AL001',
      nombre: 'Luis Pérez',
      carrera: 'Ingeniería Civil',
      puntajes: {
        psicometrica: 85,
        cognitiva: 78,
        tecnica: 92,
        proyectiva: 70,
        promedioGral: 81.25,
        fechaAplicacion: '2026-04-10'
      }
    },
    {
      alumnoId: 'AL002',
      nombre: 'Ana Ruiz',
      carrera: 'Administración',
      puntajes: null // Aún no realiza pruebas
    }
  ];

  private benchmarks: EmpresaBenchmark[] = [
    {
      empresaId: 'EMP001',
      nombre: 'Oracle México',
      puesto: 'Desarrollador Java',
      requerimientos: { psicometrica: 70, cognitiva: 80, tecnica: 85, proyectiva: 60 },
      pesos: { psicometrica: 10, cognitiva: 20, tecnica: 50, proyectiva: 20 }
    }
  ];

  constructor() { }

  getPuntajesAlumno(id: string): Observable<AlumnoPuntajes | undefined> {
    return of(this.dbAlumnos.find(a => a.alumnoId === id)).pipe(delay(300));
  }

  // Record scores (Only once)
  registrarPuntajes(id: string, puntajes: BateriaPuntajes): Observable<boolean> {
    const alumno = this.dbAlumnos.find(a => a.alumnoId === id);
    if (alumno && !alumno.puntajes) {
      alumno.puntajes = puntajes;
      console.log('Puntajes registrados como Fuente de Verdad para:', id);
      return of(true).pipe(delay(500));
    }
    console.error('El alumno ya cuenta con puntajes. No se permite repetición de pruebas.');
    return of(false);
  }

  getBenchmarks(): Observable<EmpresaBenchmark[]> {
    return of(this.benchmarks);
  }
}
