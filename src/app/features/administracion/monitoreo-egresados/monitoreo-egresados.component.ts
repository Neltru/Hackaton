import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoreoService } from '../../../core/services/monitoreo.service';
import { MonitoreoStats, MonitoreoPromedioCarrera, HistogramaDataPoint } from '../../../core/models/monitoreo.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-monitoreo-egresados',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './monitoreo-egresados.component.html',
  styleUrl: './monitoreo-egresados.component.scss'
})
export class MonitoreoEgresadosComponent implements OnInit {
  isLoading = true;
  stats: MonitoreoStats | null = null;
  promedios: MonitoreoPromedioCarrera[] = [];
  histograma: HistogramaDataPoint[] = [];

  // --- ApexCharts: Histograma + Campana de Gauss ---
  public mixedChartOptions: any = {
    series: [
      {
        name: "Frecuencia (Alumnos)",
        type: "column",
        data: []
      },
      {
        name: "Distribución Normal (Gauss)",
        type: "line",
        data: []
      }
    ],
    chart: {
      height: 400,
      type: "line",
      stacked: false,
      toolbar: { show: false },
      foreColor: '#888'
    },
    stroke: {
      width: [0, 3],
      curve: "smooth"
    },
    colors: ['#3b82f6', '#10b981'],
    plotOptions: {
      bar: {
        columnWidth: "80%",
        borderRadius: 4
      }
    },
    fill: {
      opacity: [0.85, 1],
      gradient: {
        inverseColors: false,
        shade: 'light',
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100]
      }
    },
    labels: [],
    markers: { size: 0 },
    xaxis: {
      title: { text: 'Puntaje Obtenido', style: { color: '#666' } }
    },
    yaxis: [
      {
        title: { text: "Número de Alumnos", style: { color: '#3b82f6' } },
      },
      {
        opposite: true,
        title: { text: "Densidad de Probabilidad", style: { color: '#10b981' } },
        labels: { show: false }
      }
    ],
    grid: { borderColor: '#333' },
    tooltip: { shared: true, intersect: false, theme: 'dark' }
  };

  // Filters
  selectedCarrera = 'Todas las carreras';
  selectedAnio = '2025';

  constructor(private monitoreoService: MonitoreoService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    let pendingRequests = 3;

    this.monitoreoService.getStats(this.selectedCarrera, this.selectedAnio).subscribe(data => {
      this.stats = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.monitoreoService.getPromedios(this.selectedCarrera, this.selectedAnio).subscribe(data => {
      this.promedios = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.monitoreoService.getHistograma(this.selectedCarrera, this.selectedAnio).subscribe(data => {
      this.histograma = data;
      
      // Actualizar gráfica mixta
      this.mixedChartOptions.series[0].data = data.map(p => p.frecuencia);
      this.mixedChartOptions.series[1].data = data.map(p => p.gaussCurva);
      this.mixedChartOptions.labels = data.map(p => p.rango);

      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
