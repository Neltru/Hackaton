import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommended-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommended-jobs.component.html',
  styleUrl: './recommended-jobs.component.scss'
})
export class RecommendedJobsComponent {
  jobs = [
    { title: 'Desarrolladora de software', company: 'NovaTech', location: 'CDMX', type: 'Tiempo completo', match: 93 },
    { title: 'Analista de datos junior', company: 'DataGroup', location: 'Remoto', type: 'Proyecto', match: 88 },
    { title: 'Backend engineer', company: 'FinTech MX', location: 'Guadalajara', type: 'Híbrido', match: 75 }
  ];
}
