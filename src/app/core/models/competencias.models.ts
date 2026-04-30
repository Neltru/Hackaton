export interface HabilidadRanking {
  nombre: string;
  puntaje: number; // 0-100 para la barra
}

export interface CompetenciasRanking {
  tecnicas: HabilidadRanking[];
  blandas: HabilidadRanking[];
}
