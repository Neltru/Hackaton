export type EstadoConvenio = 'Activo' | 'Pendiente' | 'Por vencer';
export type TipoConvenio = 'Automático' | 'Contratación' | 'Manual';
export type ZonaConvenio = 'Norte Nayarit' | 'Nacional';

export interface Convenio {
  id: string;
  empresa: string;
  zona: ZonaConvenio;
  tipo: TipoConvenio;
  estado: EstadoConvenio;
  fechaVencimiento: string | null;
}

export interface ConveniosStats {
  activos: number;
  pendientes: number;
  porVencer: number;
}

// RF-25 Reporte de estatus
export interface EmpresaPendiente {
  empresa: string;
  egresado: string;
  vacante: string;
  diasPendiente: number;
}

export interface EmpresaPorVencer {
  empresa: string;
  fechaVencimiento: string;
}

export interface ReporteConveniosStats {
  activas: number;
  proximosVencer: number;
  pendientesFormalizacion: number;
}

// RF-27 Mapa de calor
export interface MapaRegion {
  id: string;
  nombre: string;
  convenios: number;
  tipo: 'automatico' | 'contratacion';
  intensidad: number; // 0 a 100 para calcular el color
  size: 'large' | 'medium' | 'small';
}

export interface MapaStats {
  zonaNorte: number;
  nacional: number;
}
