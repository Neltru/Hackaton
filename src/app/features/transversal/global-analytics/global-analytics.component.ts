import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { GlobalMetrics, AnalyticsFilter } from '../../../core/models/analytics.models';

@Component({
  selector: 'app-global-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-analytics.component.html',
  styleUrl: './global-analytics.component.scss'
})
export class GlobalAnalyticsComponent implements OnInit {
  metrics: GlobalMetrics | null = null;
  loading: boolean = true;

  filters: AnalyticsFilter = {
    fechaInicio: '2026-01-01',
    fechaFin: '2026-12-31',
    carrera: 'Todas',
    zona: 'Todas'
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.updateAnalytics();
  }

  updateAnalytics(): void {
    this.loading = true;
    this.analyticsService.getGlobalMetrics(this.filters).subscribe(data => {
      this.metrics = data;
      this.loading = false;
    });
  }

  onFilterChange(): void {
    this.updateAnalytics();
  }

  getTrendPath(): string {
    if (!this.metrics) return '';
    const points = this.metrics.tendenciaHistorica;
    const width = 400;
    const height = 150;
    const stepX = width / (points.length - 1);
    
    let path = `M 0,${height - points[0].valor}`;
    points.forEach((p, i) => {
      if (i === 0) return;
      path += ` L ${i * stepX},${height - p.valor}`;
    });
    return path;
  }
}
