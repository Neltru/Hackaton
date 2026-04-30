export interface MonitoreoStats {
  promedioGlobal: number;
  puntajeMin: number;
  puntajeMax: number;
  desviacionEstandar: number;
}

export interface MonitoreoPromedioCarrera {
  carrera: string;
  psicometrica: number | null;
  cognitiva: number | null;
  tecnica: number | null;
  proyectiva: number | null;
}

export interface HistogramaDataPoint {
  rango: string;
  frecuencia: number;
  gaussCurva: number;
}
