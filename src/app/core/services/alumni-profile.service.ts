import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AlumniProfile, AlumniProfileUpdate } from '../models/alumni-profile.models';
import { API_CONFIG } from '../constants/api.constants';
import { MOCK_ALUMNI_PROFILE } from '../mocks/alumni-mock.data';

@Injectable({
  providedIn: 'root'
})
export class AlumniProfileService {
  private readonly apiUrl = `${API_CONFIG.baseUrl}/alumni/profile`;

  constructor(private readonly http: HttpClient) { }

  getProfile(): Observable<AlumniProfile> {
    return this.http.get<AlumniProfile>(this.apiUrl).pipe(
      catchError(() => of(MOCK_ALUMNI_PROFILE))
    );
  }

  updateProfile(payload: AlumniProfileUpdate): Observable<AlumniProfile> {
    return this.http.put<AlumniProfile>(this.apiUrl, payload).pipe(
      catchError(() => of({ ...MOCK_ALUMNI_PROFILE, ...payload }))
    );
  }

  marcarContratacion(payload: { vacante_id: number, empresa_id: number }): Observable<any> {
    return this.http.post(`${API_CONFIG.baseUrl}/alumni/marcar-contratacion`, payload).pipe(
      catchError(() => of({ success: true, message: 'Contratación registrada (modo simulado)' }))
    );
  }
}
