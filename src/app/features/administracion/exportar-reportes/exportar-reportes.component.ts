import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exportar-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exportar-reportes.component.html',
  styleUrl: './exportar-reportes.component.scss'
})
export class ExportarReportesComponent {
  
  // Data for checkboxes
  reportesOptions = [
    { id: 'estatus-convenios', label: 'Estatus de convenios', selected: true },
    { id: 'insercion-laboral', label: 'Inserción laboral por carrera', selected: false },
    { id: 'ranking-competencias', label: 'Ranking de competencias', selected: true },
    { id: 'nivel-egresados', label: 'Nivel de egresados', selected: false },
    { id: 'mapa-convenios', label: 'Mapa de convenios', selected: false }
  ];

  // Dates
  fechaInicio: string = '2026-01';
  fechaFin: string = '2026-04';

  // Preview generated date
  get fechaGeneracion(): string {
    return formatDate(new Date(), 'dd MMM yyyy', 'en-US').toLowerCase(); // Approx for "29 abr 2026"
  }

  descargarPDF(): void {
    // Simulated action
    console.log('Descargando PDF...', this.getSelectedReportes());
  }

  descargarExcel(): void {
    // Simulated action
    console.log('Descargando Excel...', this.getSelectedReportes());
  }

  private getSelectedReportes() {
    return this.reportesOptions.filter(r => r.selected).map(r => r.id);
  }
}
