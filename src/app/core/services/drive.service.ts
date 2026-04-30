import { Injectable } from '@angular/core';
import { Observable, of, interval } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import { DriveFile, UploadStatus } from '../models/drive.models';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  private mockArchivos: DriveFile[] = [
    {
      id: 'D001',
      nombre: 'CV_Luis_Perez_2026.pdf',
      tipo: 'CV',
      extension: 'pdf',
      url_drive: 'https://drive.google.com/file/d/1abc123...',
      tamanio_kb: 1240,
      fecha_subida: '2026-04-20',
      propietario_id: 'AL001'
    },
    {
      id: 'D002',
      nombre: 'Certificado_Ingles_B2.jpg',
      tipo: 'Certificado',
      extension: 'jpg',
      url_drive: 'https://drive.google.com/file/d/2xyz789...',
      tamanio_kb: 850,
      fecha_subida: '2026-04-22',
      propietario_id: 'AL001'
    },
    {
      id: 'D003',
      nombre: 'Reporte_Convenios_Abril.pdf',
      tipo: 'Reporte',
      extension: 'pdf',
      url_drive: 'https://drive.google.com/file/d/3mno456...',
      tamanio_kb: 2100,
      fecha_subida: '2026-04-29',
      propietario_id: 'ADMIN'
    }
  ];

  constructor() { }

  getArchivos(): Observable<DriveFile[]> {
    return of(this.mockArchivos).pipe(delay(500));
  }

  // Simulate upload to Google Drive API
  subirArchivo(file: File, tipo: DriveFile['tipo']): Observable<UploadStatus> {
    // Simulated upload progress
    return interval(200).pipe(
      take(6),
      map(step => {
        const progreso = (step + 1) * 20;
        if (progreso < 100) {
          return { progreso, estado: 'Subiendo' as const };
        } else {
          // Final file data
          const nuevoArchivo: DriveFile = {
            id: `D00${this.mockArchivos.length + 1}`,
            nombre: file.name,
            tipo: tipo,
            extension: file.name.split('.').pop() || '',
            url_drive: `https://drive.google.com/file/d/new_${Math.random().toString(36).substr(2, 9)}`,
            tamanio_kb: Math.round(file.size / 1024),
            fecha_subida: new Date().toISOString().split('T')[0],
            propietario_id: 'USER_LOGGED'
          };
          this.mockArchivos.unshift(nuevoArchivo);
          return { progreso: 100, estado: 'Completado' as const };
        }
      })
    );
  }

  eliminarArchivo(id: string): Observable<boolean> {
    this.mockArchivos = this.mockArchivos.filter(a => a.id !== id);
    return of(true).pipe(delay(300));
  }
}
