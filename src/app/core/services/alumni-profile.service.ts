import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AlumniProfile, AlumniProfileUpdate } from '../models/alumni-profile.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AlumniProfileService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/alumni/profile`;

  constructor(private readonly http: HttpClient) { }

  getProfile(): Observable<AlumniProfile> {
    return this.http.get<AlumniProfile>(this.apiUrl).pipe(
      catchError(() => of(this.getFallbackProfile()))
    );
  }

  updateProfile(payload: AlumniProfileUpdate): Observable<AlumniProfile> {
    return this.http.put<AlumniProfile>(this.apiUrl, payload);
  }

  private getFallbackProfile(): AlumniProfile {
    return {
      cve_alumno: '2021-0001',
      matricula: '2021301234',
      nombre: 'Nelson',
      apellido_paterno: 'Rios',
      apellido_materno: 'Patron',
      correo_institucional: 'alumni@utdelacosta.edu.mx',
      carrera_id: 1,
      carrera_nombre: 'Ingeniería en Tecnologías de la Información',
      periodo_egreso: '2024-08-01',
      disponibilidad: 'activo',
      correo_alternativo: '',
      telefono: '',
      resumen_profesional: 'Perfil de egresado enfocado en el desarrollo profesional.',
      experiencias: [],
      certificados: []
    };
  }
}
