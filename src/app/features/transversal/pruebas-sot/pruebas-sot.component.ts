import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PruebasSotService } from '../../../core/services/pruebas-sot.service';
import { AlumnoPuntajes, EmpresaBenchmark, BateriaPuntajes } from '../../../core/models/pruebas-sot.models';

@Component({
  selector: 'app-pruebas-sot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pruebas-sot.component.html',
  styleUrl: './pruebas-sot.component.scss'
})
export class PruebasSotComponent implements OnInit {
  alumno: AlumnoPuntajes | null = null;
  benchmarks: EmpresaBenchmark[] = [];
  loading: boolean = true;
  realizandoPrueba: boolean = false;

  constructor(private sotService: PruebasSotService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    // Simulamos que el usuario logueado es Ana Ruiz (sin puntajes)
    this.sotService.getPuntajesAlumno('AL002').subscribe(data => {
      this.alumno = data || null;
      this.loading = false;
    });

    this.sotService.getBenchmarks().subscribe(data => this.benchmarks = data);
  }

  iniciarPrueba(): void {
    this.realizandoPrueba = true;
  }

  finalizarPrueba(): void {
    if (!this.alumno) return;
    
    // Generación de puntajes simulada (Fuente de Verdad)
    const nuevosPuntajes: BateriaPuntajes = {
      psicometrica: Math.floor(Math.random() * 40) + 60,
      cognitiva: Math.floor(Math.random() * 40) + 60,
      tecnica: Math.floor(Math.random() * 40) + 60,
      proyectiva: Math.floor(Math.random() * 40) + 60,
      promedioGral: 0,
      fechaAplicacion: new Date().toISOString().split('T')[0]
    };
    nuevosPuntajes.promedioGral = (nuevosPuntajes.psicometrica + nuevosPuntajes.cognitiva + nuevosPuntajes.tecnica + nuevosPuntajes.proyectiva) / 4;

    this.sotService.registrarPuntajes(this.alumno.alumnoId, nuevosPuntajes).subscribe(success => {
      if (success) {
        this.realizandoPrueba = false;
        this.loadData();
      }
    });
  }

  getCompatibilidad(bench: EmpresaBenchmark): number {
    if (!this.alumno?.puntajes) return 0;
    const p = this.alumno.puntajes;
    const r = bench.requerimientos;
    
    const diff = 
      Math.abs(p.psicometrica - r.psicometrica) +
      Math.abs(p.cognitiva - r.cognitiva) +
      Math.abs(p.tecnica - r.tecnica) +
      Math.abs(p.proyectiva - r.proyectiva);
      
    return Math.max(0, 100 - (diff / 4));
  }
}
