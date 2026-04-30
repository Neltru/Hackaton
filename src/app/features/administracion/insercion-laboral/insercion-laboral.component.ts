import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsercionService } from '../../../core/services/insercion.service';
import { InsercionGlobalStats, InsercionCarrera } from '../../../core/models/insercion.models';

@Component({
  selector: 'app-insercion-laboral',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insercion-laboral.component.html',
  styleUrl: './insercion-laboral.component.scss'
})
export class InsercionLaboralComponent implements OnInit {
  isLoading = true;
  
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
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
