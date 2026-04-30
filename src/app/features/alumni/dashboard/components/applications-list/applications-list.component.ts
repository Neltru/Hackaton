import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.scss'
})
export class ApplicationsListComponent {
  applications = [
    { title: 'Ing. de software', company: 'NovaTech', days: 3, status: 'En revisión', statusType: 'info' },
    { title: 'Analista de datos', company: 'DataGroup', days: 5, status: 'En pruebas', statusType: 'warning' },
    { title: 'Dev backend', company: 'FinTech MX', days: 7, status: 'Enviada', statusType: 'success' },
    { title: 'QA Engineer', company: 'SoftCorp', days: 10, status: 'Pendiente', statusType: 'neutral' }
  ];
}
