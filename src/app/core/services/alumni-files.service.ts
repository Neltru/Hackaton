import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DriveFileRef } from '../models/alumni-profile.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AlumniFilesService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/alumni/profile`;

  constructor(private readonly http: HttpClient) {}

  uploadPhoto(file: File): Observable<HttpEvent<DriveFileRef>> {
    const formData = this.toFormData(file);
    return this.http.post<DriveFileRef>(`${this.baseUrl}/photo`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadCv(file: File): Observable<HttpEvent<DriveFileRef>> {
    const formData = this.toFormData(file);
    return this.http.post<DriveFileRef>(`${this.baseUrl}/cv`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadCertificate(file: File): Observable<HttpEvent<DriveFileRef>> {
    return this.http.post<DriveFileRef>(`${this.baseUrl}/certificates`, this.toFormData(file), {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/files/${fileId}`);
  }

  private toFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }
}
