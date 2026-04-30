import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
}

export interface VacantesResult {
  vacantes: Vacante[];
  total: number;
}

export interface VacantesFiltros {
  query?: string;
  employment_type?: string;    // FULLTIME, PARTTIME, CONTRACTOR, INTERN
  date_posted?: string;        // all, today, 3days, week, month
  remote_only?: boolean;
  page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VacantesService {
  private apiUrl = 'https://jsearch.p.rapidapi.com/search';
  private apiKey = 'fcb7756235msh2a0de96d767fe0dp113a68jsn380c7abf1b1f';

  constructor(private http: HttpClient) { }

  getVacantes(filtros: VacantesFiltros = {}): Observable<VacantesResult> {
    const headers = new HttpHeaders({
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    });

    let params = new HttpParams()
      .set('query', filtros.query || 'jobs in Mexico')
      .set('page', (filtros.page || 1).toString())
      .set('num_pages', '1')
      .set('date_posted', filtros.date_posted || 'all');

    if (filtros.employment_type) {
      params = params.set('employment_types', filtros.employment_type);
    }

    if (filtros.remote_only) {
      params = params.set('remote_jobs_only', 'true');
    }

    return this.http.get<any>(this.apiUrl, { headers, params }).pipe(
      map(response => ({
        vacantes: this.transformData(response.data || []),
        total: response.status === 'OK' ? (response.data?.length || 0) * 10 : 0
      }))
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