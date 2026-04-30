import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  message: string;
  highlight: string;
  time: string;
  typeColor: string;
}

@Component({
  selector: 'app-recent-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-notifications.component.html',
  styleUrl: './recent-notifications.component.scss'
})
export class RecentNotificationsComponent {
  notifications: Notification[] = [
    { message: 'Luisa Torres aceptó la oferta para', highlight: 'Desarrollador Full Stack.', time: 'Hace 2 h', typeColor: 'success' },
    { message: '14 nuevas postulaciones para', highlight: 'Desarrollador Full Stack.', time: 'Hoy, 9:15', typeColor: 'info' },
    { message: 'La vacante', highlight: 'Analista de Datos', time: 'Ayer', typeColor: 'warning' }, // Using a slight text hack for "está pausada..." in HTML
    { message: 'Entrevista confirmada con', highlight: 'Alicia García', time: 'Ayer', typeColor: 'info' }
  ];
}
