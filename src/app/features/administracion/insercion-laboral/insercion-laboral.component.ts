import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsercionService } from '../../../core/services/insercion.service';
import { InsercionGlobalStats, InsercionCarrera } from '../../../core/models/insercion.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-insercion-laboral',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './insercion-laboral.component.html',
  styleUrl: './insercion-laboral.component.scss'
})
export class InsercionLaboralComponent implements OnInit {
  isLoading = true;

  // --- ApexCharts: Comparativa por Carrera ---
  public chartOptions: any = {
    series: [
      {
        name: "Porcentaje de Inserción",
        data: []
      }
    ],
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      foreColor: 'var(--text-muted)'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '60%'
      }
    },
    colors: ['#2d6a4f'],
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val + "%",
      style: { colors: ['#fff'] }
    },
    xaxis: {
      categories: [],
      max: 100,
      labels: { style: { colors: 'var(--text-muted)', fontWeight: 600 } }
    },
    grid: { borderColor: 'rgba(45, 106, 79, 0.1)' },
    tooltip: { theme: 'light' },
    annotations: {
      xaxis: [
        {
          x: 70,
          borderColor: '#ffb800',
          label: {
            text: 'Meta 70%',
            style: { color: '#fff', background: '#ffb800' }
          }
        }
      ]
    }
  };
  
  // Filters
  selectedAnio = '2025';
  selectedCarrera = 'Todas las carreras';

  // Data
  stats: InsercionGlobalStats | null = null;
  carreras: InsercionCarrera[] = [];

  // Goal
  metaInsercion = 70;

  constructor(private insercionService: InsercionService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    let pendingRequests = 2;

    this.insercionService.getGlobalStats(this.selectedAnio, this.selectedCarrera).subscribe(data => {
      this.stats = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.insercionService.getInsercionPorCarrera(this.selectedAnio).subscribe(data => {
      this.carreras = data;
      
      // Actualizar gráfica
      this.chartOptions.series[0].data = data.map(c => c.porcentaje);
      this.chartOptions.xaxis.categories = data.map(c => c.carrera);

      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
