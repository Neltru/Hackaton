import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlumniPostulacion, VacantesService } from '../../../core/services/vacantes.service';

@Component({
  selector: 'app-postulaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './postulaciones.component.html',
  styleUrl: './postulaciones.component.scss'
})
export class PostulacionesComponent implements OnInit {
  isLoading = true;
  postulaciones: AlumniPostulacion[] = [];

  constructor(private readonly vacantesService: VacantesService) { }

  ngOnInit(): void {
    this.vacantesService.getAlumniPostulaciones().subscribe((items) => {
      this.postulaciones = items;
      this.isLoading = false;
    });
  }

  statusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('entrevista') || normalized.includes('contrat')) return 'ok';
    if (normalized.includes('rechaz') || normalized.includes('cerr') || normalized.includes('final')) return 'closed';
    return 'review';
  }
}
