// Basado en la tabla resultados_pruebas del esquema de BD

export interface ResultadoPrueba {
  resultado_id: number;
  alumno_id: number;

  // Puntajes (0-100 o null si no completada)
  puntaje_psicometrico: number | null;
  puntaje_cognitivo: number | null;
  puntaje_tecnico: number | null;     // Solo Admin y TI (NULL si carrera no aplica)
  puntaje_proyectivo: number | null;

  // Timestamps de completación
  psicometrico_completado_at: string | null;
  cognitivo_completado_at: string | null;
  tecnico_completado_at: string | null;
  proyectivo_completado_at: string | null;
}

export type EstadoPrueba = 'pendiente' | 'en_progreso' | 'completada';

// Claves de puntaje de la tabla resultados_pruebas
export type PuntajeKey =
  | 'puntaje_psicometrico'
  | 'puntaje_cognitivo'
  | 'puntaje_tecnico'
  | 'puntaje_proyectivo';

// Claves de timestamp de la tabla resultados_pruebas
export type CompletadoKey =
  | 'psicometrico_completado_at'
  | 'cognitivo_completado_at'
  | 'tecnico_completado_at'
  | 'proyectivo_completado_at';

export interface PruebaInfo {
  key: PuntajeKey;
  completadoKey: CompletadoKey;
  nombre: string;
  descripcion: string;
  icono: string;
  duracion: string;
  instrucciones: string;
}
