import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyReportesService, MetricasVacantes, EmpleadoUT } from '../../../core/services/company-reportes.service';
import { ExportService } from '../../../core/services/export.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {
  metricas!: MetricasVacantes;
  plantilla: EmpleadoUT[] = [];

  // --- ApexCharts: Candidatos por Puesto ---
  public chartOptions: any = {
    series: [{
      name: "Candidatos",
      data: []
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      foreColor: '#888'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: 'end',
        horizontal: true,
      }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: true,
      style: { colors: ['#fff'] }
    },
    xaxis: {
      categories: [],
    },
    grid: {
      borderColor: '#333'
    },
    tooltip: {
      theme: 'dark'
    }
  };

  // Modal State
  isModalOpen = false;
  selectedEmpleado: EmpleadoUT | null = null;
  evaluacionForm = {
    estrellas: 5,
    comentarios: ''
  };

  constructor(
    private reportesService: CompanyReportesService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.reportesService.getMetricas().subscribe((m: MetricasVacantes) => {
      this.metricas = m;
      // Actualizar gráfica de ApexCharts
      this.chartOptions.series[0].data = m.postulacionesPorPuesto.map(p => p.postulaciones);
      this.chartOptions.xaxis.categories = m.postulacionesPorPuesto.map(p => p.puesto);
    });
    this.reportesService.getPlantillaUT().subscribe((p: EmpleadoUT[]) => this.plantilla = p);
  }

  // --- Export Actions ---
  exportPDF(): void {
    this.exportService.exportToPdfViaPrint('Reporte_Analitica_y_Plantilla_UT');
  }

  exportExcel(): void {
    const exportData = this.plantilla.map(e => ({
      'ID Empleado': e.id,
      'Nombre': e.nombre,
      'Puesto': e.puesto,
      'Fecha de Contratación': new Date(e.fechaContratacion).toLocaleDateString(),
      'Calificación (Estrellas)': e.evaluacion?.estrellas || 'Pendiente',
      'Comentarios de Desempeño': e.evaluacion?.comentarios || 'N/A'
    }));

    this.exportService.exportToCsv(exportData, 'Plantilla_UT', ['ID Empleado', 'Nombre', 'Puesto', 'Fecha de Contratación', 'Calificación (Estrellas)', 'Comentarios de Desempeño']);
  }

  // --- Modal Logic ---
  openEvaluarModal(empleado: EmpleadoUT): void {
    this.selectedEmpleado = empleado;
    this.evaluacionForm = {
      estrellas: empleado.evaluacion?.estrellas || 5,
      comentarios: empleado.evaluacion?.comentarios || ''
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEmpleado = null;
  }

  setStars(stars: number): void {
    this.evaluacionForm.estrellas = stars;
  }

  saveEvaluacion(): void {
    if (this.selectedEmpleado && this.evaluacionForm.comentarios.trim()) {
      this.reportesService.evaluarEmpleado(
        this.selectedEmpleado.id,
        this.evaluacionForm.estrellas,
        this.evaluacionForm.comentarios
      );
      this.closeModal();
    }
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
