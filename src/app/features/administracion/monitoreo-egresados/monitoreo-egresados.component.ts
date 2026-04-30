import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoreoService } from '../../../core/services/monitoreo.service';
import { MonitoreoStats, MonitoreoPromedioCarrera, HistogramaDataPoint } from '../../../core/models/monitoreo.models';

@Component({
  selector: 'app-monitoreo-egresados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoreo-egresados.component.html',
  styleUrl: './monitoreo-egresados.component.scss'
})
export class MonitoreoEgresadosComponent implements OnInit {
  isLoading = true;
  stats: MonitoreoStats | null = null;
  promedios: MonitoreoPromedioCarrera[] = [];
  histograma: HistogramaDataPoint[] = [];

  // Filters
  selectedCarrera = 'Todas las carreras';
  selectedAnio = '2025';

  constructor(private monitoreoService: MonitoreoService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    let pendingRequests = 3;

    this.monitoreoService.getStats(this.selectedCarrera, this.selectedAnio).subscribe(data => {
      this.stats = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.monitoreoService.getPromedios(this.selectedCarrera, this.selectedAnio).subscribe(data => {
      this.promedios = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });

    this.monitoreoService.getHistograma(this.selectedCarrera, this.selectedAnio).subscribe(data => {
      this.histograma = data;
      pendingRequests--;
      if (pendingRequests === 0) this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }

  // Calculate SVG path for the Gauss curve based on histogram data
  getGaussPath(): string {
    if (!this.histograma || this.histograma.length === 0) return '';
    
    const width = 800; // SVG viewBox width
    const height = 200; // SVG viewBox height
    const pointsCount = this.histograma.length;
    const stepX = width / pointsCount;
    
    // We normalize the gaussCurva to the height (assuming max curve is 100)
    // and draw a smooth path. In the SVG Y=0 is top, so we invert.
    let path = '';
    
    this.histograma.forEach((point, index) => {
      const x = (index * stepX) + (stepX / 2); // Center of the bar
      const y = height - (point.gaussCurva * (height / 100)); // Normalized Y

      if (index === 0) {
        path += `M${x},${y} `;
      } else {
        // Simple curve approximation using bezier
        const prevX = ((index - 1) * stepX) + (stepX / 2);
        const prevY = height - (this.histograma[index - 1].gaussCurva * (height / 100));
        
        const cp1x = prevX + (x - prevX) / 2;
        const cp1y = prevY;
        const cp2x = prevX + (x - prevX) / 2;
        const cp2y = y;

        path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y} `;
      }
    });

    return path;
  }
}
