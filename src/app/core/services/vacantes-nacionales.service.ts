import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VacanteNacional, AlertaConvenio } from '../models/vacantes-nacionales.models';

@Injectable({
  providedIn: 'root'
})
export class VacantesNacionalesService {

  private mockVacantes: VacanteNacional[] = [
    {
      id: 'VN001',
      titulo: 'Desarrollador Java Senior',
      empresa: 'Oracle México',
      ubicacion: 'Guadalajara, JAL',
      salario: '$45,000 - $55,000',
      modalidad: 'Híbrido',
      fecha_publicacion: '2026-04-25',
      link_externo: 'https://mx.indeed.com/jobs/vn001',
      es_nacional: true
    },
    {
      id: 'VN002',
      titulo: 'Analista de Datos',
      empresa: 'BBVA Bancomer',
      ubicacion: 'CDMX',
      salario: '$30,000 - $35,000',
      modalidad: 'Remoto',
      fecha_publicacion: '2026-04-28',
      link_externo: 'https://mx.linkedin.com/jobs/vn002',
      es_nacional: true
    },
    {
      id: 'VN003',
      titulo: 'Ingeniero de Procesos',
      empresa: 'Tesla México',
      ubicacion: 'Monterrey, NL',
      salario: '$40,000',
      modalidad: 'Presencial',
      fecha_publicacion: '2026-04-20',
      link_externo: 'https://mx.glassdoor.com/jobs/vn003',
      es_nacional: true
    }
  ];

  private mockAlertas: AlertaConvenio[] = [
    {
      id: 'AL001',
      egresado_nombre: 'Luis Pérez',
      empresa_nacional: 'Oracle México',
      fecha_contratacion: '2026-04-29',
      estatus: 'Pendiente'
    }
  ];

  constructor() { }

  // Simulate API fetch from external provider (free tier)
  getVacantesNacionales(): Observable<VacanteNacional[]> {
    return of(this.mockVacantes).pipe(delay(600));
  }

  getAlertasConvenio(): Observable<AlertaConvenio[]> {
    return of(this.mockAlertas).pipe(delay(400));
  }

  // Trigger alert when graduate marks hiring in national company
  marcarContratacionNacional(egresado: string, vacante: VacanteNacional): Observable<boolean> {
    const nuevaAlerta: AlertaConvenio = {
      id: `AL00${this.mockAlertas.length + 1}`,
      egresado_nombre: egresado,
      empresa_nacional: vacante.empresa,
      fecha_contratacion: new Date().toISOString().split('T')[0],
      estatus: 'Pendiente'
    };
    this.mockAlertas.unshift(nuevaAlerta);
    return of(true).pipe(delay(300));
  }
}
