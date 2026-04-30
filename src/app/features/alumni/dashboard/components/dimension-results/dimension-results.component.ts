import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TestsService, TestResult } from '../../../../../core/services/tests.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dimension-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dimension-results.component.html',
  styleUrl: './dimension-results.component.scss'
})
export class DimensionResultsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef;
  chart: any;
  private testsSub?: Subscription;

  constructor(private testsService: TestsService) { }

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

    this.testsService.getTests().subscribe(tests => {
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
              backgroundColor: 'rgba(45, 106, 79, 0.9)',
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
                color: '#2d6a4f',
                font: {
                  size: 14,
                  weight: 900,
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
