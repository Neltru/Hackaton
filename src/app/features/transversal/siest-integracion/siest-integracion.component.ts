import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiestService } from '../../../core/services/siest.service';
import { SiestAlumno, SiestApiResponse, SiestConsultaLog } from '../../../core/models/siест.models';

@Component({
  selector: 'app-siest-integracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './siest-integracion.component.html',
  styleUrl: './siest-integracion.component.scss'
})
export class SiestIntegracionComponent implements OnInit {
  cveAlumnoInput: string = 'CVE001';
  loading: boolean = false;
  response: SiestApiResponse | null = null;
  logs: SiestConsultaLog[] = [];

  constructor(private siestService: SiestService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  consultar(): void {
    if (!this.cveAlumnoInput.trim()) return;

    this.loading = true;
    this.response = null;

    this.siestService.consultarAlumno(this.cveAlumnoInput).subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
        if (res.ok && res.alumno) {
          this.siestService.guardarEnLocal(res.alumno).subscribe();
        }
        this.loadLogs();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error in SIEst integration', err);
      }
    });
  }

  loadLogs(): void {
    this.siestService.getLogs().subscribe(logs => this.logs = logs);
  }

  getStatusClass(resultado: string): string {
    switch (resultado) {
      case 'encontrado': return 'status-success';
      case 'no_encontrado': return 'status-warning';
      case 'error': return 'status-danger';
      default: return '';
    }
  }
}
