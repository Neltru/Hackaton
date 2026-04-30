import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VacantesService, Vacante, VacantesFiltros } from '../../../core/services/vacantes.service';

@Component({
  selector: 'app-vacantes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vacantes.component.html',
  styleUrl: './vacantes.component.scss'
})
export class VacantesComponent implements OnInit {
  vacantes: Vacante[] = [];
  isLoading = true;

  // Filtros alineados con JSearch API
  searchQuery = '';
  selectedType = '';       // FULLTIME, PARTTIME, CONTRACTOR, INTERN
  selectedDatePosted = 'all'; // all, today, 3days, week, month
  selectedModality = '';   // remote_only boolean

  // Opciones de filtros reales de la API
  types = [
    { label: 'Todos', value: '' },
    { label: 'Tiempo completo', value: 'FULLTIME' },
    { label: 'Medio tiempo', value: 'PARTTIME' },
    { label: 'Contrato', value: 'CONTRACTOR' },
    { label: 'Prácticas', value: 'INTERN' }
  ];

  datesPosted = [
    { label: 'Cualquier fecha', value: 'all' },
    { label: 'Hoy', value: 'today' },
    { label: 'Últimos 3 días', value: '3days' },
    { label: 'Esta semana', value: 'week' },
    { label: 'Este mes', value: 'month' }
  ];

  modalities = [
    { label: 'Todas', value: '' },
    { label: 'Remoto', value: 'remote' },
    { label: 'Presencial', value: 'onsite' }
  ];

  // Paginación
  currentPage = 1;
  totalResults = 0;
  readonly pageSize = 10;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize));
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  constructor(private vacantesService: VacantesService) {}

  ngOnInit(): void {
    this.fetchVacantes();
  }

  fetchVacantes(): void {
    this.isLoading = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const filtros: VacantesFiltros = {
      query: this.searchQuery.trim() || 'jobs in Mexico',
      page: this.currentPage,
      date_posted: this.selectedDatePosted,
      remote_only: this.selectedModality === 'remote',
    };

    if (this.selectedType) {
      filtros.employment_type = this.selectedType;
    }

    this.vacantesService.getVacantes(filtros).subscribe({
      next: ({ vacantes, total }) => {
        this.vacantes = vacantes;
        this.totalResults = total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vacantes:', err);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.fetchVacantes();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchVacantes();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.selectedDatePosted = 'all';
    this.selectedModality = '';
    this.currentPage = 1;
    this.fetchVacantes();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.fetchVacantes();
  }

  getInitials(company: string): string {
    return company.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  imgFallback(event: Event, company: string): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent && !parent.querySelector('.company-logo')) {
      const div = document.createElement('div');
      div.className = 'company-logo';
      div.textContent = this.getInitials(company);
      parent.insertBefore(div, img);
    }
  }
}
