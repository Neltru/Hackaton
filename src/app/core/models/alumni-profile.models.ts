export interface DriveFileRef {
  fileId: string;
  fileName: string;
  mimeType: string;
  viewUrl: string;
  downloadUrl?: string;
  uploadedAt?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface Certificate {
  id?: string;
  title: string;
  institution: string;
  issueDate?: string;
  expiresAt?: string;
  credentialId?: string;
  file?: DriveFileRef;
}

export interface AlumniProfile {
  // Datos del SIEst 2.0 (Read-only)
  alumno_id?: number;
  cve_alumno: string;
  matricula: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string;
  carrera_id: number;
  carrera_nombre?: string;
  periodo_egreso: string;
  foto_url?: string;
  correo_institucional: string;

  // Perfil adicional (Editable)
  correo_alternativo?: string;
  cv_drive_url?: string;
  telefono?: string;
  linkedin_url?: string;
  disponibilidad: 'activo' | 'no_disponible' | 'contratado';
  
  // Transversal
  resumen_profesional?: string;
  experiencias?: WorkExperience[];
  certificados?: Certificate[];
}

export interface AlumniProfileUpdate {
  correo_alternativo?: string;
  cv_drive_url?: string;
  telefono?: string;
  linkedin_url?: string;
  disponibilidad: 'activo' | 'no_disponible' | 'contratado';
  resumen_profesional?: string;
}
