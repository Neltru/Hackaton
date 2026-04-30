import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { GlobalMetrics, AnalyticsFilter } from '../../../core/models/analytics.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-global-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './global-analytics.component.html',
  styleUrl: './global-analytics.component.scss'
})
export class GlobalAnalyticsComponent implements OnInit {
  metrics: GlobalMetrics | null = null;
  loading: boolean = true;

  // --- ApexCharts: Tendencia Histórica ---
  public chartOptions: any = {
    series: [
      {
        name: "Índice de Actividad",
        data: []
      }
    ],
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      foreColor: '#888'
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: [],
      axisBorder: { show: false }
    },
    grid: { borderColor: '#333' },
    tooltip: { theme: 'dark' }
  };

  filters: AnalyticsFilter = {
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    carrera: 'Todas',
    zona: 'Todas'
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.updateAnalytics();
  }

  updateAnalytics(): void {
    this.loading = true;
    this.analyticsService.getGlobalMetrics(this.filters).subscribe(data => {
      this.metrics = data;
      
      // Actualizar gráfica
      this.chartOptions.series[0].data = data.tendenciaHistorica.map(p => p.valor);
      this.chartOptions.xaxis.categories = data.tendenciaHistorica.map(p => p.label);

      this.loading = false;
    });
  }

  onFilterChange(): void {
    this.updateAnalytics();
  }
}
