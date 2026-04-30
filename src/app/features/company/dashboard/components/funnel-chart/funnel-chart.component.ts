import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FunnelStage {
  name: string;
  count: number;
  progress: number;
  colorClass: string;
}

@Component({
  selector: 'app-funnel-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funnel-chart.component.html',
  styleUrl: './funnel-chart.component.scss'
})
export class FunnelChartComponent {
  funnelStages: FunnelStage[] = [
    { name: 'Recibidas', count: 143, progress: 100, colorClass: 'primary' },
    { name: 'Revisadas', count: 89, progress: 62, colorClass: 'info' },
    { name: 'Entrevistas', count: 24, progress: 17, colorClass: 'warning' },
    { name: 'Ofertas', count: 7, progress: 5, colorClass: 'success-light' },
    { name: 'Contratados', count: 5, progress: 3, colorClass: 'success' }
  ];

  // Dummy data for the weekly chart (just for visual representation without a library)
  weeklyData = [30, 45, 25, 60, 40, 15, 10];
  days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
}
