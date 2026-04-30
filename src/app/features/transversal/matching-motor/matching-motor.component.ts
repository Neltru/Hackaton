import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchingService } from '../../../core/services/matching.service';
import { PruebasSotService } from '../../../core/services/pruebas-sot.service';
import { AlumnoPuntajes, EmpresaBenchmark } from '../../../core/models/pruebas-sot.models';

@Component({
  selector: 'app-matching-motor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matching-motor.component.html',
  styleUrl: './matching-motor.component.scss'
})
export class MatchingMotorComponent implements OnInit {
  alumnos: AlumnoPuntajes[] = [
    {
      alumnoId: 'AL001', nombre: 'Luis Pérez', carrera: 'TI',
      puntajes: { psicometrica: 85, cognitiva: 78, tecnica: 92, proyectiva: 70, promedioGral: 81, fechaAplicacion: '' }
    },
    {
      alumnoId: 'AL002', nombre: 'Ana Ruiz', carrera: 'ADM',
      puntajes: { psicometrica: 72, cognitiva: 88, tecnica: 65, proyectiva: 82, promedioGral: 77, fechaAplicacion: '' }
    },
    {
      alumnoId: 'AL003', nombre: 'Carlos Sosa', carrera: 'TI',
      puntajes: { psicometrica: 60, cognitiva: 65, tecnica: 88, proyectiva: 55, promedioGral: 67, fechaAplicacion: '' }
    }
  ];

  selectedBenchmark: EmpresaBenchmark = {
    empresaId: 'EMP001',
    nombre: 'Tech Solutions',
    puesto: 'Senior Developer',
    requerimientos: { psicometrica: 70, cognitiva: 70, tecnica: 85, proyectiva: 60 },
    pesos: { psicometrica: 10, cognitiva: 20, tecnica: 50, proyectiva: 20 } // La técnica pesa más
  };

  umbral = 80;
  matchingResults: any[] = [];

  constructor(private matchingService: MatchingService) {}

  ngOnInit(): void {
    this.umbral = this.matchingService.getUmbralRelevancia();
    this.calculateMatches();
  }

  calculateMatches(): void {
    this.matchingResults = this.alumnos.map(a => ({
      alumno: a,
      score: this.matchingService.calcularMatch(a, this.selectedBenchmark)
    })).sort((a, b) => b.score - a.score);
  }

  updateWeights(): void {
    // Asegurar que sumen 100 o similar (en la demo solo recalculamos)
    this.calculateMatches();
  }
}
