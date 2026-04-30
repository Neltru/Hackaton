import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VacantesService, AlumniPostulacion } from '../../../../../core/services/vacantes.service';
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
  applications: Array<{
    id: string;
    vacanteId: string;
    jobTitle: string;
    company: string;
    status: string;
    statusClass: string;
  }> = [];
  isLoading = true;
  showHiringModal = false;
  selectedApp: any = null;

  // Formulario
  hiringLocation = '';
  hiringPosition = '';

  constructor(
    private vacantesService: VacantesService,
    private hiringService: HiringService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.vacantesService.getAlumniPostulaciones().subscribe((items: AlumniPostulacion[]) => {
      this.applications = items.slice(0, 5).map((item) => ({
        id: item.id,
        vacanteId: item.vacanteId,
        jobTitle: item.vacanteTitulo,
        company: item.empresaNombre,
        status: item.estado,
        statusClass: this.getStatusClass(item.estado)
      }));
      this.isLoading = false;
    });
  }

  private getStatusClass(status: string): string {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('entrevista') || normalized.includes('contrat')) return 'status-interview';
    if (normalized.includes('rechaz') || normalized.includes('cerr') || normalized.includes('final')) return 'status-closed';
    return 'status-review';
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

  goToAllApplications(): void {
    this.router.navigate(['/alumni/postulaciones']);
  }
}
