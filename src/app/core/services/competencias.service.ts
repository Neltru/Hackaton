import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CompetenciasRanking } from '../models/competencias.models';

@Injectable({
  providedIn: 'root'
})
export class CompetenciasService {

  private mockRanking: CompetenciasRanking = {
    tecnicas: [
      { nombre: 'Excel avanzado', puntaje: 87 },
      { nombre: 'Programación', puntaje: 74 },
      { nombre: 'AutoCAD', puntaje: 62 },
      { nombre: 'Contabilidad', puntaje: 55 },
      { nombre: 'Redes', puntaje: 48 }
    ],
    blandas: [
      { nombre: 'Trabajo en eq...', puntaje: 91 },
      { nombre: 'Comunicación', puntaje: 83 },
      { nombre: 'Liderazgo', puntaje: 71 },
      { nombre: 'Resolución pr...', puntaje: 66 },
      { nombre: 'Adaptabilidad', puntaje: 59 }
    ]
  };

  constructor() { }

  getRanking(carreraFiltro: string): Observable<CompetenciasRanking> {
    return of(this.mockRanking).pipe(delay(300));
  }
}
