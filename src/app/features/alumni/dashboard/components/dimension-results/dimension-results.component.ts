import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TestsService, TestResult } from '../../../../../core/services/tests.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dimension-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card dimension-card">
      <div class="card-header">
        <h3>Resultados por Dimensión</h3>
        <p>Tu balance de competencias actuales</p>
      </div>
      <div class="chart-container">
        <canvas #radarCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    .dimension-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 1.5rem;
      padding: 1.5rem;
      height: 100%;
    }
    .card-header h3 { margin: 0; font-size: 1.1rem; }
    .card-header p { margin: 0.25rem 0 1.5rem; font-size: 0.85rem; color: var(--text-muted); }
    .chart-container {
      position: relative;
      height: 250px;
      width: 100%;
    }
  `]
})
export class DimensionResultsComponent implements OnInit, AfterViewInit {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef;
  chart: any;

  constructor(private testsService: TestsService) {}

  ngOnInit(): void {
    // Escuchar cambios en las pruebas para actualizar el gráfico
    this.testsService.getTests().subscribe(() => {
      if (this.chart) this.updateChart();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    
    this.testsService.getTests().subscribe((tests: TestResult[]) => {
      const scores = [
        tests.find(t => t.id === 'psico')?.score || 0,
        tests.find(t => t.id === 'cogni')?.score || 0,
        tests.find(t => t.id === 'tech')?.score || 0,
        tests.find(t => t.id === 'proy')?.score || 0
      ];

      this.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Psicométrica', 'Cognitiva', 'Técnica', 'Proyectiva'],
          datasets: [{
            label: 'Mi Perfil',
            data: scores,
            backgroundColor: 'rgba(79, 140, 246, 0.2)',
            borderColor: 'rgba(79, 140, 246, 1)',
            pointBackgroundColor: 'rgba(79, 140, 246, 1)',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              angleLines: { color: 'rgba(255,255,255,0.1)' },
              grid: { color: 'rgba(255,255,255,0.1)' },
              pointLabels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } },
              ticks: { display: false, stepSize: 20 },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });
    });
  }

  private updateChart(): void {
    this.testsService.getTests().subscribe((tests: TestResult[]) => {
      const scores = [
        tests.find(t => t.id === 'psico')?.score || 0,
        tests.find(t => t.id === 'cogni')?.score || 0,
        tests.find(t => t.id === 'tech')?.score || 0,
        tests.find(t => t.id === 'proy')?.score || 0
      ];
      this.chart.data.datasets[0].data = scores;
      this.chart.update();
    });
  }
}
