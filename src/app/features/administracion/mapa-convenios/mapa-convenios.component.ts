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
      style: { color: "var(--primary)", fontSize: "16px", fontWeight: "800" }
    },
    colors: [
      "#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2", "#b7e4c7"
    ],
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: true
      }
    },
    tooltip: { theme: 'light' }
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
