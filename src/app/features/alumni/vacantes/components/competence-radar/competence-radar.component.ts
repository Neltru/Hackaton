import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TestsService, TestResult } from '../../../../../core/services/tests.service';

Chart.register(...registerables);

@Component({
  selector: 'app-competence-radar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="radar-container">
      <canvas #radarCanvas></canvas>
      <div class="legend" *ngIf="isLoaded">
        <div class="legend-item">
          <span class="dot alumni"></span> Tu Perfil
        </div>
        <div class="legend-item">
          <span class="dot ideal"></span> Perfil Idóneo
        </div>
      </div>
    </div>
  `,
  styles: [`
    .radar-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 1.5rem;
      border: 1px solid var(--border-color);
    }
    .legend {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1rem;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      &.alumni { background: rgba(79, 140, 246, 1); }
      &.ideal { background: rgba(34, 197, 94, 1); }
    }
  `]
})
export class CompetenceRadarComponent implements OnInit, AfterViewInit {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef;
  @Input() idealScores: any;
  
  alumniScores: number[] = [0, 0, 0, 0];
  isLoaded = false;
  chart: any;

  constructor(private testsService: TestsService) {}

  ngOnInit(): void {
    this.testsService.getTests().subscribe((tests: TestResult[]) => {
      // Mapear los resultados del egresado
      this.alumniScores = [
        tests.find(t => t.id === 'psico')?.score || 0,
        tests.find(t => t.id === 'cogni')?.score || 0,
        tests.find(t => t.id === 'tech')?.score || 0,
        tests.find(t => t.id === 'proy')?.score || 0
      ];
      if (this.chart) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Psicométrico', 'Cognitivo', 'Técnico', 'Proyectivo'],
        datasets: [
          {
            label: 'Tu Perfil',
            data: this.alumniScores,
            fill: true,
            backgroundColor: 'rgba(79, 140, 246, 0.2)',
            borderColor: 'rgba(79, 140, 246, 1)',
            pointBackgroundColor: 'rgba(79, 140, 246, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(79, 140, 246, 1)',
            borderWidth: 2
          },
          {
            label: 'Perfil Idóneo',
            data: [
              this.idealScores?.psico || 85,
              this.idealScores?.cogni || 85,
              this.idealScores?.tech || 85,
              this.idealScores?.proy || 85
            ],
            fill: true,
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgba(34, 197, 94, 1)',
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: { size: 10, weight: 'bold' }
            },
            ticks: {
              display: false,
              stepSize: 20
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
    this.isLoaded = true;
  }

  updateChart(): void {
    this.chart.data.datasets[0].data = this.alumniScores;
    this.chart.update();
  }
}
