import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacantesService } from '../../../../../core/services/vacantes.service';
import { HiringService } from '../../../../../core/services/hiring.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.scss'
})
export class ApplicationsListComponent implements OnInit {
  applications: any[] = [];
  isLoading = true;
  showHiringModal = false;
  selectedApp: any = null;

  // Formulario
  hiringLocation = '';
  hiringPosition = '';

  constructor(
    private vacantesService: VacantesService,
    private hiringService: HiringService
  ) { }

  ngOnInit(): void {
    this.vacantesService.getVacantes().subscribe(result => {
      this.applications = result.vacantes.slice(2, 5).map(v => ({
        id: v.id,
        jobTitle: v.title,
        company: v.company,
        appliedDate: 'Hace 3 días',
        status: this.getRandomStatus(),
        statusClass: this.getStatusClass(this.getRandomStatus())
      }));
      this.isLoading = false;
    });
  }

  private getRandomStatus(): string {
    const statuses = ['En revisión', 'Entrevista', 'Finalizado'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  private getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'En revisión': 'status-review',
      'Entrevista': 'status-interview',
      'Finalizado': 'status-closed'
    };
    return classes[status] || '';
  }

  openHiringModal(app: any): void {
    this.selectedApp = app;
    this.hiringPosition = app.jobTitle;
    this.showHiringModal = true;
  }

  submitHiring(): void {
    if (!this.hiringLocation) return;

    this.hiringService.reportHiring({
      companyName: this.selectedApp.company,
      location: this.hiringLocation,
      isNational: !this.hiringLocation.toLowerCase().includes('norte de nayarit'),
      position: this.hiringPosition,
      startDate: new Date()
    });

    this.showHiringModal = false;
    // Opcional: Marcar la aplicación como contratada visualmente
    this.selectedApp.status = 'Contratado';
    this.selectedApp.statusClass = 'status-interview'; // Usamos verde
  }
}
