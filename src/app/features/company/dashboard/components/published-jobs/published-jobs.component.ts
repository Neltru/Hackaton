import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Job {
  title: string;
  location: string;
  salary: string;
  status: 'Activa' | 'Pausada' | 'Nueva';
  statusClass: string;
  applicationsCount: number;
  iconInitials: string;
  iconBg: string;
}

@Component({
  selector: 'app-published-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './published-jobs.component.html',
  styleUrl: './published-jobs.component.scss'
})
export class PublishedJobsComponent {
  jobs: Job[] = [
    {
      title: 'Desarrollador Full Stack',
      location: 'Remoto',
      salary: '$35,000 - $50,000 MXN',
      status: 'Activa',
      statusClass: 'success',
      applicationsCount: 42,
      iconInitials: '💻', // Using emojis instead of complex SVG for simplicity
      iconBg: '#2a3b5a' // dark blue
    },
    {
      title: 'Gerente de Marketing',
      location: 'Guadalajara',
      salary: '$28,000 MXN',
      status: 'Activa',
      statusClass: 'success',
      applicationsCount: 19,
      iconInitials: '👤',
      iconBg: '#2e4130' // dark green
    },
    {
      title: 'Analista de Datos',
      location: 'Híbrido',
      salary: '$22,000 - $30,000 MXN',
      status: 'Pausada',
      statusClass: 'warning',
      applicationsCount: 8,
      iconInitials: '📊',
      iconBg: '#4a3b2c' // dark orange/brown
    },
    {
      title: 'UX / UI Designer',
      location: 'Remoto',
      salary: '$20,000 MXN',
      status: 'Nueva',
      statusClass: 'info',
      applicationsCount: 3,
      iconInitials: '✨',
      iconBg: '#353535' // dark gray
    }
  ];
}
