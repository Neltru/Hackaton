import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface PostulacionPuesto {
  puesto: string;
  postulaciones: number;
}

export interface MetricasVacantes {
  tiempoPromedioCoberturaDias: number;
  postulacionesPorPuesto: PostulacionPuesto[];
  totalVacantesPublicadas: number;
  totalContrataciones: number;
}

export interface EmpleadoUT {
  id: string;
  nombre: string;
  puesto: string;
  fechaContratacion: Date;
  evaluacion?: {
    estrellas: number;
    comentarios: string;
    fechaEvaluacion: Date;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyReportesService {

  private mockMetricas: MetricasVacantes = {
    tiempoPromedioCoberturaDias: 14.5,
    totalVacantesPublicadas: 12,
    totalContrataciones: 8,
    postulacionesPorPuesto: [
      { puesto: 'Desarrollador Full Stack', postulaciones: 42 },
      { puesto: 'Gerente de Marketing', postulaciones: 19 },
      { puesto: 'Analista de Datos', postulaciones: 35 },
      { puesto: 'Diseñador UI/UX', postulaciones: 28 }
    ]
  };

  private mockPlantilla: EmpleadoUT[] = [
    {
      id: 'E1',
      nombre: 'Ana García',
      puesto: 'Desarrollador Frontend',
      fechaContratacion: new Date('2023-01-15'),
      evaluacion: { estrellas: 5, comentarios: 'Excelente desempeño, gran adaptabilidad.', fechaEvaluacion: new Date('2023-06-20') }
    },
    {
      id: 'E2',
      nombre: 'Carlos López',
      puesto: 'Ingeniero Backend',
      fechaContratacion: new Date('2023-03-10')
    },
    {
      id: 'E3',
      nombre: 'María Rodríguez',
      puesto: 'Analista Financiero',
      fechaContratacion: new Date('2023-05-02')
    }
  ];

  private plantillaSubject = new BehaviorSubject<EmpleadoUT[]>(this.mockPlantilla);

  constructor() { }

  getMetricas(): Observable<MetricasVacantes> {
    return of(this.mockMetricas);
  }

  getPlantillaUT(): Observable<EmpleadoUT[]> {
    return this.plantillaSubject.asObservable();
  }

  evaluarEmpleado(id: string, estrellas: number, comentarios: string): void {
    const empleado = this.mockPlantilla.find(e => e.id === id);
    if (empleado) {
      empleado.evaluacion = {
        estrellas,
        comentarios,
        fechaEvaluacion: new Date()
      };
      this.plantillaSubject.next(this.mockPlantilla);
    }
  }
}
