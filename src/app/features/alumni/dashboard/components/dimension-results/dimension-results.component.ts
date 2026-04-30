import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TestsService } from '../../../../../core/services/tests.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dimension-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card dimension-card">
      <div class="card-header">
        <div class="header-content">
          <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          </div>
          <div class="text-group">
            <h3>Balance de Competencias</h3>
            <p>Resultados acumulados por dimensión</p>
          </div>
        </div>
      </div>
      <div class="chart-wrapper">
        <div class="chart-container">
          <canvas #radarCanvas></canvas>
        </div>
      </div>
      <div class="chart-legend">
        <div class="legend-item">
          <span class="dot"></span>
          <span>Desempeño actual</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dimension-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 2rem;
      padding: 2rem;
      height: 100%;
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
    }

    .card-header {
      margin-bottom: 1rem;
      .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .icon-box {
        background: #f0f7f4;
        color: var(--primary);
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid rgba(45, 106, 79, 0.1);
      }
      h3 { margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--primary); letter-spacing: -0.01em; }
      p { margin: 0.1rem 0 0; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
    }

    .chart-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 550px;
      padding: 1rem;
    }

    .chart-container {
      position: relative;
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    }

    .chart-legend {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-muted);
        .dot {
          width: 10px;
          height: 10px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--primary-light);
        }
      }
    }
  `]
})
export class DimensionResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef;
  chart: any;
  private testsSub?: Subscription;

  constructor(private testsService: TestsService) {}

  ngOnInit(): void {
    // Escuchar cambios para actualizar
    this.testsSub = this.testsService.getTests().subscribe(() => {
      if (this.chart) this.updateChart();
    });
  }

  ngOnDestroy(): void {
    if (this.testsSub) this.testsSub.unsubscribe();
    if (this.chart) this.chart.destroy();
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  private initChart(): void {
    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    
    // Obtener datos iniciales y crear gráfico
    this.testsService.getTests().subscribe(tests => {
      if (this.chart) this.chart.destroy();

      const scores = [
        tests.find(t => t.id === 'psico')?.score || 0,
        tests.find(t => t.id === 'cogni')?.score || 0,
        tests.find(t => t.id === 'tech')?.score || 0,
        tests.find(t => t.id === 'proy')?.score || 0
      ];

      this.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['PSICOMÉTRICA', 'COGNITIVA', 'TÉCNICA', 'PROYECTIVA'],
          datasets: [{
            label: 'Mi Perfil',
            data: scores,
            backgroundColor: 'rgba(45, 106, 79, 0.15)',
            borderColor: 'rgba(45, 106, 79, 1)',
            pointBackgroundColor: 'rgba(45, 106, 79, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 7,
            borderWidth: 4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: 50
          },
          plugins: { 
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1b4332',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              padding: 12,
              cornerRadius: 10,
              displayColors: false
            }
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              angleLines: { 
                display: true,
                color: '#edf2f0', 
                lineWidth: 1.5 
              },
              grid: { 
                display: true,
                color: '#edf2f0', 
                lineWidth: 1.5 
              },
              pointLabels: { 
                display: true,
                color: '#1b4332', 
                font: { 
                  size: 14, 
                  weight: '900',
                  family: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
                },
                padding: 25
              },
              ticks: { 
                display: false,
                stepSize: 20 
              }
            }
          }
        }
      });
    });
  }

  private updateChart(): void {
    this.testsService.getTests().subscribe(tests => {
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
