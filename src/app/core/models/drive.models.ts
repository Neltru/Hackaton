export interface DriveFile {
  id: string;
  nombre: string;
  tipo: 'CV' | 'Certificado' | 'Reporte' | 'Imagen';
  extension: string;
  url_drive: string;
  tamanio_kb: number;
  fecha_subida: string;
  propietario_id: string; // ID del alumno o admin
}

export interface UploadStatus {
  progreso: number;
  estado: 'Pendiente' | 'Subiendo' | 'Completado' | 'Error';
  error?: string;
}
