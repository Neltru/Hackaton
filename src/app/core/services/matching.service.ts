import { Injectable } from '@angular/core';
import { AlumnoPuntajes, BateriaPuntajes, EmpresaBenchmark } from '../models/pruebas-sot.models';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {

  constructor() { }

  /**
   * Calcula la coincidencia basada en una fórmula ponderada.
   * La fórmula compara la distancia entre el puntaje del alumno y el requerimiento,
   * multiplicada por el peso (importancia) de esa dimensión.
   */
  calcularMatch(alumno: AlumnoPuntajes, bench: EmpresaBenchmark): number {
    if (!alumno.puntajes) return 0;

    const p = alumno.puntajes;
    const r = bench.requerimientos;
    const w = bench.pesos;

    // Calculamos el match por dimensión (0 a 100)
    // Usamos una lógica donde si el alumno supera el requerimiento, es 100% en esa área.
    // Si es menor, restamos proporcionalmente.
    const mPsi = p.psicometrica >= r.psicometrica ? 100 : (p.psicometrica / r.psicometrica) * 100;
    const mCog = p.cognitiva >= r.cognitiva ? 100 : (p.cognitiva / r.cognitiva) * 100;
    const mTec = p.tecnica >= r.tecnica ? 100 : (p.tecnica / r.tecnica) * 100;
    const mPro = p.proyectiva >= r.proyectiva ? 100 : (p.proyectiva / r.proyectiva) * 100;

    // Aplicamos ponderación (pesos deben sumar 100 o normalizarse)
    const totalPesos = w.psicometrica + w.cognitiva + w.tecnica + w.proyectiva;
    
    const finalMatch = (
      (mPsi * w.psicometrica) +
      (mCog * w.cognitiva) +
      (mTec * w.tecnica) +
      (mPro * w.proyectiva)
    ) / totalPesos;

    return Math.round(finalMatch);
  }

  getUmbralRelevancia(): number {
    return 80;
  }
}
