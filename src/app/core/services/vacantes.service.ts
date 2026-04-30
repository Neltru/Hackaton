import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { API_CONFIG } from '../constants/api.constants';
import { MOCK_VACANTES, MOCK_POSTULACIONES } from '../mocks/alumni-mock.data';

export interface Vacante {
  id: string;
  title: string;
  company: string;
  employer_logo: string | null;
  location: string;
  type: string;
  modality: string;
  description: string;
  published_at: string;
  publisher: string;
  match: number;
  recommended?: boolean;
  status?: 'pendiente' | 'postulada';
  category: string;
  apply_link: string;
  ideal_scores?: {
    psico: number;
    cogni: number;
    tech: number;
    proy: number;
  };
}

export interface AlumniPostulacion {
  id: string;
  vacanteId: string;
  vacanteTitulo: string;
  empresaNombre: string;
  fechaPostulacion?: string;
  estado: string;
}

export interface VacantesResult {
  vacantes: Vacante[];
  total: number;
}

export interface VacantesFiltros {
  query?: string;
  employment_type?: string;
  date_posted?: string;
  remote_only?: boolean;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VacantesService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/vacantes`;
  private readonly alumniUrl = `${API_CONFIG.baseUrl}/alumni`;

  constructor(private http: HttpClient) { }

  postular(vacanteId: string, mensaje: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(`${this.apiUrl}/${vacanteId}/postulaciones`, { mensaje }).pipe(
      map((res) => ({
        success: true,
        message: res?.message || 'Tu postulación ha sido enviada exitosamente a la empresa.'
      })),
      catchError(() =>
        of({
          success: false,
          message: 'No fue posible enviar tu postulación en este momento.'
        })
      )
    );
  }

  getVacantes(filtros: VacantesFiltros = {}): Observable<VacantesResult> {
    let params = new HttpParams();
    if (filtros.query) params = params.set('query', filtros.query);
    if (filtros.employment_type) params = params.set('employment_type', filtros.employment_type);
    if (filtros.date_posted) params = params.set('date_posted', filtros.date_posted);
    if (typeof filtros.remote_only === 'boolean') params = params.set('remote_only', String(filtros.remote_only));
    if (filtros.page) params = params.set('page', String(filtros.page));

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        vacantes: this.transformData(response?.data || response?.vacantes || response || []),
        total: Number(response?.total || response?.meta?.total || response?.data?.length || 0)
      })),
      catchError(() => of({ vacantes: MOCK_VACANTES, total: MOCK_VACANTES.length }))
    );
  }

  getAlumniPostulaciones(): Observable<AlumniPostulacion[]> {
    return this.http.get<any>(`${this.alumniUrl}/postulaciones`).pipe(
      map((response) => {
        const rows = response?.data || response?.postulaciones || response || [];
        return (rows as any[]).map((item, index) => ({
          id: String(item.id || item.postulacion_id || index + 1),
          vacanteId: String(item.vacante_id || item.vacanteId || item.vacante?.id || ''),
          vacanteTitulo: item.vacante_titulo || item.vacanteTitulo || item.vacante?.title || item.titulo || 'Vacante',
          empresaNombre: item.empresa_nombre || item.empresaNombre || item.empresa?.nombre || item.company || 'Empresa',
          fechaPostulacion: item.fecha_postulacion || item.created_at || item.applied_at,
          estado: item.estado || item.status || 'En revisión'
        }));
      }),
      catchError(() => of(MOCK_POSTULACIONES))
    );
  }

  private transformData(data: any[]): Vacante[] {
    return data.map((job, index) => ({
      id: job.job_id || index.toString(),
      title: job.job_title || 'Puesto no especificado',
      company: job.employer_name || 'Empresa Confidencial',
      employer_logo: job.employer_logo || null,
      location: job.job_location || [job.job_city, job.job_state].filter(Boolean).join(', ') || 'México',
      type: this.normalizeType(job.job_employment_type),
      modality: job.job_is_remote ? 'Remoto' : 'Presencial',
      description: job.job_description
        ? job.job_description.substring(0, 200) + '...'
        : 'Sin descripción disponible.',
      published_at: job.job_posted_at || 'Recientemente',
      publisher: job.job_publisher || '',
      match: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
      recommended: index < 2,
      category: job.job_title?.split(' ')[0] || 'Tecnología',
      status: 'pendiente',
      apply_link: job.job_apply_link || '#'
    }));
  }

  private normalizeType(type: string): string {
    const map: Record<string, string> = {
      'FULLTIME': 'Tiempo completo',
      'PARTTIME': 'Medio tiempo',
      'CONTRACTOR': 'Contrato',
      'INTERN': 'Prácticas',
      'Full-time': 'Tiempo completo',
      'Part-time': 'Medio tiempo',
    };
    return map[type] || type || 'Tiempo completo';
  }
}