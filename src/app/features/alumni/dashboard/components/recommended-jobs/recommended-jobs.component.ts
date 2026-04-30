import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VacantesService, Vacante } from '../../../../../core/services/vacantes.service';

@Component({
  selector: 'app-recommended-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recommended-jobs.component.html',
  styleUrl: './recommended-jobs.component.scss'
})
export class RecommendedJobsComponent implements OnInit {
  recommendedJobs: Vacante[] = [];
  isLoading = true;

  constructor(private vacantesService: VacantesService) {}

  ngOnInit(): void {
    this.vacantesService.getVacantes().subscribe({
      next: (result) => {
        // Ordenar por match y tomar las primeras 3
        this.recommendedJobs = result.vacantes
          .sort((a, b) => b.match - a.match)
          .slice(0, 3);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getInitials(company: string): string {
    return company.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
