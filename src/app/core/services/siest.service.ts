import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SiestAlumno, SiestApiResponse, SiestConsultaLog } from '../models/siест.models';

@Injectable({
  providedIn: 'root'
})
export class SiestService {

  // Mock database of students in SIEst 2.0
  private mockSiestDb: SiestAlumno[] = [
    {
      cve_alumno: 'CVE001',
      matricula: '20213001',
      nombre: 'Juan',
      apellidos: 'Pérez García',
      carrera_id: 'TI',
      carrera_nombre: 'Tecnologías de la Información',
      periodo_egreso: '2021-2023',
      foto: 'https://i.pravatar.cc/150?u=CVE001'
    },
    {
      cve_alumno: 'CVE002',
      matricula: '20213002',
      nombre: 'María',
      apellidos: 'López Hernández',
      carrera_id: 'ADM',
      carrera_nombre: 'Administración',
      periodo_egreso: '2021-2023',
      foto: 'https://i.pravatar.cc/150?u=CVE002'
    },
    {
      cve_alumno: 'CVE003',
      matricula: '20213003',
      nombre: 'Carlos',
      apellidos: 'Sánchez Ruiz',
      carrera_id: 'CIV',
      carrera_nombre: 'Ingeniería Civil',
      periodo_egreso: '2020-2022',
      foto: 'https://i.pravatar.cc/150?u=CVE003'
    }
  ];

  private consultaLogs: SiestConsultaLog[] = [];

  constructor() { }

  // Simulate consult from SIEst 2.0 endpoint
  consultarAlumno(cve_alumno: string): Observable<SiestApiResponse> {
    const latencia = Math.floor(Math.random() * 800) + 200; // 200ms to 1000ms
    
    return of(null).pipe(
      delay(latencia),
      map(() => {
        const alumno = this.mockSiestDb.find(a => a.cve_alumno === cve_alumno);
        
        const response: SiestApiResponse = {
          ok: !!alumno,
          latencia_ms: latencia,
          origen: 'SIEST_2.0_ENDPOINT_MOCK',
          alumno: alumno || null,
          error: alumno ? undefined : 'Alumno no encontrado en el sistema SIEst 2.0'
        };

        // Add to logs
        this.consultaLogs.unshift({
          timestamp: new Date().toISOString(),
          cve_alumno: cve_alumno,
          resultado: alumno ? 'encontrado' : 'no_encontrado',
          latencia_ms: latencia,
          cacheado: false
        });

        return response;
      })
    );
  }

  getLogs(): Observable<SiestConsultaLog[]> {
    return of(this.consultaLogs);
  }

  // Simulate local DB storage (Cache)
  guardarEnLocal(alumno: SiestAlumno): Observable<boolean> {
    console.log('Guardando alumno en BD local para evitar sobrecarga:', alumno.matricula);
    return of(true).pipe(delay(300));
  }
}
