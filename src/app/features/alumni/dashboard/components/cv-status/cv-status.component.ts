import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cv-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv-status.component.html',
  styleUrl: './cv-status.component.scss'
})
export class CvStatusComponent {
  statusItems = [
    { label: 'Datos personales', description: 'Completo', completed: true, action: 'Editar' },
    { label: 'Experiencia laboral', description: '2 entradas registradas', completed: true, action: 'Editar' },
    { label: 'Certificaciones', description: 'Incompleto', incomplete: true, action: 'Agregar' },
    { label: 'Trayectoria académica', description: 'Sin registrar', action: 'Agregar' }
  ];
}
