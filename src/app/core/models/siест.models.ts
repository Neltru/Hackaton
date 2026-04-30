// Datos retornados por el endpoint SIEst 2.0
export interface SiestAlumno {
  cve_alumno: string;     // Clave única del SIEst (identificador primario)
  matricula: string;      // Distinto de cve_alumno — número de matrícula institucional
  nombre: string;
  apellidos: string;
  carrera_id: string;
  carrera_nombre: string;
  periodo_egreso: string;
  foto: string;           // URL o base64 de la foto
}

// Estado del registro en BD local (caché)
export interface SiestCacheEntry {
  cve_alumno: string;
  sincronizado: boolean;
  fechaSincronizacion: string | null;
  fuente: 'siест_2.0' | 'manual';
  datos: SiestAlumno | null;
}

// Respuesta simulada del endpoint SIEst
export interface SiestApiResponse {
  ok: boolean;
  latencia_ms: number;
  origen: string;
  alumno: SiestAlumno | null;
  error?: string;
}

// Log de consultas realizadas
export interface SiestConsultaLog {
  timestamp: string;
  cve_alumno: string;
  resultado: 'encontrado' | 'no_encontrado' | 'error';
  latencia_ms: number;
  cacheado: boolean;
}
