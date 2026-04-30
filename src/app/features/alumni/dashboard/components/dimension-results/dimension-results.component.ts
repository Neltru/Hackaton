import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dimension-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dimension-results.component.html',
  styleUrl: './dimension-results.component.scss'
})
export class DimensionResultsComponent {
  dimensions = [
    { label: 'Psicométrica', value: 82, status: 'Alta', type: 'info', color: '#4f8cf6' },
    { label: 'Cognitiva', value: 74, status: 'Media', type: 'info', color: '#4f8cf6' },
    { label: 'Técnica', value: 91, status: 'Sobresaliente', type: 'success', color: '#65a363' },
    { label: 'Proyectiva', value: 0, status: 'Pendiente', type: 'neutral', color: '#444444' }
  ];
}
