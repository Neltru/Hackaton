import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Benchmark {
  psicometrico: number;
  cognitivo: number;
  tecnico: number;
  proyectivo: number;
}

export interface CompanyVacante {
  id: string;
  title: string;
  area: string;
  salary: string;
  description: string;
  requirements: string;
  status: 'Activa' | 'Pausada' | 'Cerrada';
  applicationsCount: number;
  dateCreated: Date;
  benchmark: Benchmark;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyVacantesService {

  private mockVacantes: CompanyVacante[] = [
    {
      id: '1',
      title: 'Desarrollador Full Stack',
      area: 'Tecnología',
      salary: '$35,000 - $50,000 MXN',
      description: 'Buscamos un desarrollador con experiencia en Angular y Node.js para unirse a nuestro equipo.',
      requirements: '- 3 años de experiencia\n- Inglés intermedio\n- Conocimiento en bases de datos relacionales',
      status: 'Activa',
      applicationsCount: 42,
      dateCreated: new Date(),
      benchmark: {
        psicometrico: 70,
        cognitivo: 80,
        tecnico: 90,
        proyectivo: 65
      }
    },
    {
      id: '2',
      title: 'Gerente de Marketing',
      area: 'Marketing',
      salary: '$28,000 MXN',
      description: 'Liderar las campañas de marketing digital y estrategias de crecimiento.',
      requirements: '- Licenciatura terminada\n- Experiencia en Google Ads',
      status: 'Activa',
      applicationsCount: 19,
      dateCreated: new Date(Date.now() - 86400000 * 2),
      benchmark: {
        psicometrico: 85,
        cognitivo: 75,
        tecnico: 60,
        proyectivo: 90
      }
    }
  ];

  private vacantesSubject = new BehaviorSubject<CompanyVacante[]>(this.mockVacantes);

  constructor() { }

  getVacantes(): Observable<CompanyVacante[]> {
    return this.vacantesSubject.asObservable();
  }

  getVacanteById(id: string): CompanyVacante | undefined {
    return this.mockVacantes.find(v => v.id === id);
  }

  createVacante(vacante: Omit<CompanyVacante, 'id' | 'applicationsCount' | 'dateCreated'>): void {
    const newVacante: CompanyVacante = {
      ...vacante,
      id: Math.random().toString(36).substr(2, 9),
      applicationsCount: 0,
      dateCreated: new Date()
    };
    this.mockVacantes = [newVacante, ...this.mockVacantes];
    this.vacantesSubject.next(this.mockVacantes);
  }

  updateVacante(id: string, updates: Partial<CompanyVacante>): void {
    const index = this.mockVacantes.findIndex(v => v.id === id);
    if (index !== -1) {
      this.mockVacantes[index] = { ...this.mockVacantes[index], ...updates };
      this.vacantesSubject.next(this.mockVacantes);
    }
  }

  deleteVacante(id: string): void {
    this.mockVacantes = this.mockVacantes.filter(v => v.id !== id);
    this.vacantesSubject.next(this.mockVacantes);
  }
}
