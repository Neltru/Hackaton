import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompanyVacantesService, CompanyVacante } from '../../../../core/services/company-vacantes.service';
import { CompanyCandidatosService, CandidatoIdoneo } from '../../../../core/services/company-candidatos.service';
import { CompanyMensajesService } from '../../../../core/services/company-mensajes.service';
import { ExportService } from '../../../../core/services/export.service';

@Component({
  selector: 'app-vacante-candidatos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vacante-candidatos.component.html',
  styleUrl: './vacante-candidatos.component.scss'
})
export class VacanteCandidatosComponent implements OnInit {
  vacante: CompanyVacante | undefined;
  candidatos: CandidatoIdoneo[] = [];

  // Opciones de filtro
  carrerasDisponibles: string[] = [];
  zonasDisponibles: string[] = [];

  // Filtros activos
  filtroCarrera: string = 'Todas';
  filtroZona: string = 'Todas';
  filtroUmbral: number = 80;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacantesService: CompanyVacantesService,
    private candidatosService: CompanyCandidatosService,
    private mensajesService: CompanyMensajesService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vacante = this.vacantesService.getVacanteById(id);

      this.carrerasDisponibles = ['Todas', ...this.candidatosService.getCarrerasDisponibles()];
      this.zonasDisponibles = ['Todas', ...this.candidatosService.getZonasDisponibles()];

      this.cargarCandidatos();
    }
  }

  cargarCandidatos(): void {
    if (this.vacante && this.vacante.benchmark) {
      this.candidatosService.getCandidatosIdoneos(
        this.vacante.benchmark,
        this.filtroCarrera,
        this.filtroZona,
        this.filtroUmbral
      ).subscribe((res: CandidatoIdoneo[]) => {
        this.candidatos = res;
      });
    }
  }

  onFilterChange(): void {
    this.cargarCandidatos();
  }

  invitarCandidato(candidatoId: string): void {
    if (this.vacante) {
      const convId = this.mensajesService.startConversation(this.vacante.id, candidatoId);
      this.router.navigate(['/company/mensajes'], { queryParams: { startConv: convId } });
    }
  }

  exportPDF(): void {
    this.exportService.exportToPdfViaPrint(`Reporte_Candidatos_Idoneos_${this.vacante?.title?.replace(/\s+/g, '_')}`);
  }

  exportExcel(): void {
    if (!this.vacante) return;

    const exportData = this.candidatos.map(c => ({
      'Nombre': c.nombre,
      'Carrera': c.carrera,
      'Zona': c.zona,
      'Match Global (%)': c.matchPercentage,
      'Match Psicométrico': c.resultados.psicometrico + ' (Req: ' + this.vacante!.benchmark.psicometrico + ')',
      'Match Cognitivo': c.resultados.cognitivo + ' (Req: ' + this.vacante!.benchmark.cognitivo + ')',
      'Match Técnico': c.resultados.tecnico + ' (Req: ' + this.vacante!.benchmark.tecnico + ')',
      'Match Proyectivo': c.resultados.proyectivo + ' (Req: ' + this.vacante!.benchmark.proyectivo + ')'
    }));

    this.exportService.exportToCsv(exportData, `Candidatos_${this.vacante.title.replace(/\s+/g, '_')}`,
      ['Nombre', 'Carrera', 'Zona', 'Match Global (%)', 'Match Psicométrico', 'Match Cognitivo', 'Match Técnico', 'Match Proyectivo']);
  }
}
