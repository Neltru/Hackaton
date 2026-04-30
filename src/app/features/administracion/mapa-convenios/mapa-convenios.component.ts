import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConveniosService } from '../../../core/services/convenios.service';
import { MapaStats, MapaRegion } from '../../../core/models/convenios.models';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-mapa-convenios',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './mapa-convenios.component.html',
  styleUrl: './mapa-convenios.component.scss'
})
export class MapaConveniosComponent implements OnInit {
  isLoading = true;
  stats: MapaStats | null = null;
  regiones: MapaRegion[] = [];
  filtroZona = 'Zona norte Nayarit';

  // --- ApexCharts: Treemap de Concentración ---
  public treemapOptions: any = {
    series: [
      {
        data: []
      }
    ],
    chart: {
      height: 450,
      type: "treemap",
      toolbar: { show: false },
      background: 'transparent'
    },
    title: {
      text: "Distribución de Convenios por Región",
      align: "center",
      style: { color: "#eee", fontSize: "16px" }
    },
    colors: [
      "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: true
      }
    },
    tooltip: { theme: 'dark' }
  };

  constructor(private conveniosService: ConveniosService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    let pendingRequests = 2;

    this.conveniosService.getMapaStats().subscribe(data => {
      this.stats = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.conveniosService.getMapaRegiones(this.filtroZona).subscribe(data => {
      this.regiones = data;
      
      // Actualizar Treemap
      this.treemapOptions.series[0].data = data.map(r => ({
        x: r.nombre,
        y: r.convenios
      }));

      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
