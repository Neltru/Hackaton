import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacantesNacionalesService } from '../../../core/services/vacantes-nacionales.service';
import { VacanteNacional, AlertaConvenio } from '../../../core/models/vacantes-nacionales.models';

@Component({
  selector: 'app-vacantes-nacionales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacantes-nacionales.component.html',
  styleUrl: './vacantes-nacionales.component.scss'
})
export class VacantesNacionalesComponent implements OnInit {
  vacantes: VacanteNacional[] = [];
  alertas: AlertaConvenio[] = [];
  loading: boolean = true;
  apiStatus: 'Conectado' | 'Cargando' | 'Error' = 'Cargando';

  constructor(private vacantesService: VacantesNacionalesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.vacantesService.getVacantesNacionales().subscribe({
      next: (data) => {
        this.vacantes = data;
        this.apiStatus = 'Conectado';
        this.loading = false;
      },
      error: () => {
        this.apiStatus = 'Error';
        this.loading = false;
      }
    });

    this.vacantesService.getAlertasConvenio().subscribe(alertas => {
      this.alertas = alertas;
    });
  }

  // Simulate graduates marking hiring
  simularContratacion(vacante: VacanteNacional): void {
    const egresadoNombre = 'Ana Ruiz'; // Simulated current user
    this.vacantesService.marcarContratacionNacional(egresadoNombre, vacante).subscribe(() => {
      this.loadData();
      alert(`¡Alerta de convenio pendiente activada para ${vacante.empresa}! El administrador ha sido notificado.`);
    });
  }
}
