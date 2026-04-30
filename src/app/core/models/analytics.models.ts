export interface AnalyticsFilter {
  fechaInicio: string;
  fechaFin: string;
  carrera: string;
  zona: 'Nacional' | 'Nayarit' | 'Todas';
}

export interface MetricPoint {
  label: string;
  valor: number;
}

export interface GlobalMetrics {
  insercion: number;
  conveniosActivos: number;
  promedioEvaluacion: number;
  totalAlumnos: number;
  distribucionCarreras: MetricPoint[];
  tendenciaHistorica: MetricPoint[];
}
