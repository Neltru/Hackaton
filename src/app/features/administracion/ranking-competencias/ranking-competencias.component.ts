import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompetenciasService } from '../../../core/services/competencias.service';
import { CompetenciasRanking } from '../../../core/models/competencias.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-ranking-competencias',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './ranking-competencias.component.html',
  styleUrl: './ranking-competencias.component.scss'
})
export class RankingCompetenciasComponent implements OnInit {
  isLoading = true;
  ranking: CompetenciasRanking | null = null;
  selectedCarrera = 'Todas las carreras';

  // --- ApexCharts: Radar de Competencias ---
  public radarOptions: any = {
    series: [
      {
        name: "Puntaje Promedio",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "radar",
      toolbar: { show: false },
      foreColor: '#888'
    },
    colors: ['#10b981'],
    stroke: { width: 2 },
    fill: { opacity: 0.2 },
    markers: { size: 4 },
    xaxis: {
      categories: [],
      labels: { style: { colors: '#888' } }
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100
    },
    grid: { borderColor: '#333' },
    tooltip: { theme: 'dark' }
  };

  // --- ApexCharts: Tendencia Mensual ---
  public lineOptions: any = {
    series: [
      { name: "JavaScript", data: [30, 40, 35, 50, 49, 60, 70, 91, 125] },
      { name: "Teamwork", data: [20, 30, 25, 40, 39, 50, 60, 81, 105] },
      { name: "Cloud Computing", data: [10, 20, 15, 30, 29, 40, 50, 71, 95] }
    ],
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
      foreColor: '#888'
    },
    colors: ['#3b82f6', '#10b981', '#8b5cf6'],
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5 },
    xaxis: {
      categories: ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr"],
      labels: { style: { colors: '#888' } }
    },
    grid: { borderColor: '#333', strokeDashArray: 4 },
    tooltip: { theme: 'dark' },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#eee' }
    }
  };

  constructor(private competenciasService: CompetenciasService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.competenciasService.getRanking(this.selectedCarrera).subscribe(data => {
      this.ranking = data;
      
      // Combinar técnicas y blandas para el radar
      const allSkills = [...data.tecnicas, ...data.blandas];
      this.radarOptions.series[0].data = allSkills.map(s => s.puntaje);
      this.radarOptions.xaxis.categories = allSkills.map(s => s.nombre);

      this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
