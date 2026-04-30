import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AlumniProfile, AlumniProfileUpdate } from '../models/alumni-profile.models';

@Injectable({
  providedIn: 'root'
})
export class AlumniProfileService {
  private readonly apiUrl = 'https://api.hackaton-project.com/alumni/profile';

  constructor(private readonly http: HttpClient) {}

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
      fullName: 'Egresado Alumni',
      institutionalEmail: '',
      personalEmail: '',
      phone: '',
      summary: '',
      experiences: [],
      certificates: []
    };
  }
}
