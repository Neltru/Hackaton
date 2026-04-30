import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConveniosService } from '../../../core/services/convenios.service';
import { MapaStats, MapaRegion } from '../../../core/models/convenios.models';

@Component({
  selector: 'app-mapa-convenios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mapa-convenios.component.html',
  styleUrl: './mapa-convenios.component.scss'
})
export class MapaConveniosComponent implements OnInit {
  isLoading = true;
  stats: MapaStats | null = null;
  regiones: MapaRegion[] = [];
  filtroZona = 'Zona norte Nayarit';

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
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
