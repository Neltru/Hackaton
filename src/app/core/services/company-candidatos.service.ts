import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Benchmark } from './company-vacantes.service';

export interface EgresadoResultados {
  psicometrico: number;
  cognitivo: number;
  tecnico: number;
  proyectivo: number;
}

export interface CandidatoIdoneo {
  id: string;
  nombre: string;
  carrera: string;
  zona: string;
  resultados: EgresadoResultados;
  matchPercentage?: number; // Calculado dinámicamente
  fotoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyCandidatosService {

  // Simulamos una base de datos de egresados con sus pruebas ya definidas por la UT
  private mockEgresados: CandidatoIdoneo[] = [
    {
      id: 'E1', nombre: 'Ana García', carrera: 'Ingeniería en Sistemas', zona: 'Zona Norte',
      resultados: { psicometrico: 85, cognitivo: 90, tecnico: 95, proyectivo: 80 },
      fotoUrl: 'assets/avatars/avatar-1.png'
    },
    {
      id: 'E2', nombre: 'Carlos López', carrera: 'Ingeniería en Sistemas', zona: 'Tepic',
      resultados: { psicometrico: 75, cognitivo: 80, tecnico: 85, proyectivo: 70 },
      fotoUrl: 'assets/avatars/avatar-2.png'
    },
    {
      id: 'E3', nombre: 'María Rodríguez', carrera: 'Licenciatura en Administración', zona: 'Zona Sur',
      resultados: { psicometrico: 90, cognitivo: 85, tecnico: 70, proyectivo: 95 },
      fotoUrl: 'assets/avatars/avatar-3.png'
    },
    {
      id: 'E4', nombre: 'Javier Martínez', carrera: 'Ingeniería en Sistemas', zona: 'Zona Norte',
      resultados: { psicometrico: 60, cognitivo: 70, tecnico: 65, proyectivo: 60 },
      fotoUrl: 'assets/avatars/avatar-4.png'
    },
    {
      id: 'E5', nombre: 'Sofía Hernández', carrera: 'Licenciatura en Mercadotecnia', zona: 'Tepic',
      resultados: { psicometrico: 88, cognitivo: 82, tecnico: 75, proyectivo: 85 },
      fotoUrl: 'assets/avatars/avatar-5.png'
    }
  ];

  constructor() { }

  /**
   * Obtiene los candidatos que coinciden con el benchmark de una vacante.
   * Filtra aquellos cuyo porcentaje de match es >= umbral (ej. 80%).
   */
  getCandidatosIdoneos(
    benchmark: Benchmark, 
    carreraFilter?: string, 
    zonaFilter?: string, 
    minMatchThreshold: number = 80
  ): Observable<CandidatoIdoneo[]> {
    
    let result = this.mockEgresados.map(egresado => {
      const match = this.calculateMatch(egresado.resultados, benchmark);
      return { ...egresado, matchPercentage: match };
    });

    // Filtro estricto de umbral (siempre >= 80% como mínimo, aunque el usuario puede subirlo)
    const threshold = Math.max(80, minMatchThreshold);
    result = result.filter(c => c.matchPercentage! >= threshold);

    // Filtros opcionales
    if (carreraFilter && carreraFilter !== 'Todas') {
      result = result.filter(c => c.carrera === carreraFilter);
    }
    
    if (zonaFilter && zonaFilter !== 'Todas') {
      result = result.filter(c => c.zona === zonaFilter);
    }

    // Ordenar de mayor a menor match
    result.sort((a, b) => b.matchPercentage! - a.matchPercentage!);

    return of(result);
  }

  /**
   * Calcula el porcentaje de coincidencia.
   * Compara cada dimensión del egresado contra el benchmark de la vacante.
   * Si el egresado supera el benchmark, cuenta como 100% para esa dimensión.
   * Si no, saca la proporción.
   */
  private calculateMatch(egresado: EgresadoResultados, benchmark: Benchmark): number {
    const calcDim = (score: number, req: number) => {
      if (req === 0) return 100; // Si no hay requerimiento, es match completo
      const ratio = (score / req) * 100;
      return Math.min(100, ratio); // Tope de 100% por dimensión
    };

    const psiMatch = calcDim(egresado.psicometrico, benchmark.psicometrico);
    const cogMatch = calcDim(egresado.cognitivo, benchmark.cognitivo);
    const tecMatch = calcDim(egresado.tecnico, benchmark.tecnico);
    const proMatch = calcDim(egresado.proyectivo, benchmark.proyectivo);

    const averageMatch = Math.round((psiMatch + cogMatch + tecMatch + proMatch) / 4);
    return averageMatch;
  }

  getCarrerasDisponibles(): string[] {
    const carreras = new Set(this.mockEgresados.map(e => e.carrera));
    return Array.from(carreras);
  }

  getZonasDisponibles(): string[] {
    const zonas = new Set(this.mockEgresados.map(e => e.zona));
    return Array.from(zonas);
  }
}
