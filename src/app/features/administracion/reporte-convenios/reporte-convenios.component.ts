import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConveniosService } from '../../../core/services/convenios.service';
import { EmpresaPendiente, EmpresaPorVencer, ReporteConveniosStats } from '../../../core/models/convenios.models';

@Component({
  selector: 'app-reporte-convenios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-convenios.component.html',
  styleUrl: './reporte-convenios.component.scss'
})
export class ReporteConveniosComponent implements OnInit {
  isLoading = true;
  stats: ReporteConveniosStats | null = null;
  empresasPendientes: EmpresaPendiente[] = [];
  empresasPorVencer: EmpresaPorVencer[] = [];

  constructor(private conveniosService: ConveniosService) {}

  ngOnInit(): void {
    let pendingRequests = 3;
    
    this.conveniosService.getReporteStats().subscribe(data => {
      this.stats = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.conveniosService.getEmpresasPendientes().subscribe(data => {
      this.empresasPendientes = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.conveniosService.getEmpresasPorVencer().subscribe(data => {
      this.empresasPorVencer = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  getBadgeClass(dias: number): string {
    if (dias > 30) return 'badge-danger';
    if (dias > 15) return 'badge-warning';
    return 'badge-success';
  }
}
