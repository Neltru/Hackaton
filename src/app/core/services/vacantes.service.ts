import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

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
  private apiUrl = 'https://jsearch.p.rapidapi.com/search';
  private apiKey = 'fcb7756235msh2a0de96d767fe0dp113a68jsn380c7abf1b1f';

  // Toggle para cambiar entre API y Mock fácilmente
  private readonly useMock = true;

  constructor(private http: HttpClient) { }

  getVacantes(filtros: VacantesFiltros = {}): Observable<VacantesResult> {
    if (this.useMock) {
      return this.getMockVacantes(filtros);
    }

    // Código de la API (se mantiene intacto pero desactivado por el flag useMock)
    const headers = new HttpHeaders({
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    });

    let params = new HttpParams()
      .set('query', filtros.query || 'software developer')
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

  private getMockVacantes(filtros: VacantesFiltros): Observable<VacantesResult> {
    const mockData: Vacante[] = [
      {
        id: 'mock-1',
        title: 'Desarrollador Full Stack Senior',
        company: 'Softtek México',
        employer_logo: 'https://www.softtek.com/images/softtek-logo.png',
        location: 'Monterrey, NL (Híbrido)',
        type: 'Tiempo completo',
        modality: 'Híbrido',
        description: 'Buscamos experto en Angular y Node.js para liderar proyectos de transformación digital. Experiencia mínima 5 años.',
        published_at: 'Hace 2 horas',
        publisher: 'Softtek Careers',
        match: 92,
        recommended: true,
        category: 'Desarrollo',
        status: 'pendiente',
        apply_link: '#',
        ideal_scores: { psico: 85, cogni: 90, tech: 95, proy: 80 }
      },
      {
        id: 'mock-2',
        title: 'Frontend Developer (Angular)',
        company: 'BBVA México',
        employer_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/BBVA_logo.svg/1200px-BBVA_logo.svg.png',
        location: 'CDMX, México',
        type: 'Tiempo completo',
        modality: 'Presencial',
        description: 'Únete al equipo de banca digital de BBVA. Requerimos conocimientos sólidos en TypeScript, RxJS y diseño responsivo.',
        published_at: 'Ayer',
        publisher: 'LinkedIn',
        match: 85,
        recommended: true,
        category: 'Desarrollo',
        status: 'pendiente',
        apply_link: '#',
        ideal_scores: { psico: 80, cogni: 85, tech: 90, proy: 85 }
      },
      {
        id: 'mock-3',
        title: 'Data Analyst Junior',
        company: 'Coppel',
        employer_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Logo_Coppel.svg/2560px-Logo_Coppel.svg.png',
        location: 'Culiacán, Sin.',
        type: 'Medio tiempo',
        modality: 'Remoto',
        description: 'Análisis de datos de ventas y comportamiento de usuarios utilizando Python, SQL y Power BI.',
        published_at: 'Hace 3 días',
        publisher: 'Indeed',
        match: 78,
        recommended: false,
        category: 'Datos',
        status: 'pendiente',
        apply_link: '#',
        ideal_scores: { psico: 75, cogni: 95, tech: 70, proy: 80 }
      },
      {
        id: 'mock-4',
        title: 'UX/UI Designer',
        company: 'Mercado Libre',
        employer_logo: 'https://logospng.org/download/mercado-livre/logo-mercado-livre-2048.png',
        location: 'Remoto (México)',
        type: 'Proyecto',
        modality: 'Remoto',
        description: 'Diseño de experiencias centradas en el usuario para nuestra plataforma de e-commerce en Latinoamérica.',
        published_at: 'Hace 1 semana',
        publisher: 'Mercado Libre Jobs',
        match: 88,
        recommended: false,
        category: 'Diseño',
        status: 'pendiente',
        apply_link: '#',
        ideal_scores: { psico: 95, cogni: 80, tech: 75, proy: 90 }
      },
      {
        id: 'mock-5',
        title: 'DevOps Engineer',
        company: 'Oracle México',
        employer_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png',
        location: 'Guadalajara, Jal.',
        type: 'Tiempo completo',
        modality: 'Híbrido',
        description: 'Gestión de infraestructura en la nube, CI/CD, Kubernetes y automatización de despliegues.',
        published_at: 'Hace 4 horas',
        publisher: 'Oracle Talent',
        match: 72,
        recommended: false,
        category: 'Infraestructura',
        status: 'pendiente',
        apply_link: '#',
        ideal_scores: { psico: 80, cogni: 85, tech: 95, proy: 75 }
      },
      {
        id: 'mock-6',
        title: 'QA Automation Engineer',
        company: 'Globant',
        employer_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Globant_logo.svg/2560px-Globant_logo.svg.png',
        location: 'Remoto',
        type: 'Tiempo completo',
        modality: 'Remoto',
        description: 'Aseguramiento de calidad automatizado para proyectos internacionales de alto impacto.',
        published_at: 'Hace 12 horas',
        publisher: 'Globant Careers',
        match: 95,
        recommended: true,
        category: 'Testing',
        status: 'pendiente',
        apply_link: '#',
        ideal_scores: { psico: 85, cogni: 85, tech: 85, proy: 85 }
      }
    ];

    // Simular un retraso de red para mantener el efecto de carga
    return of({
      vacantes: mockData,
      total: mockData.length
    }).pipe(delay(800));
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