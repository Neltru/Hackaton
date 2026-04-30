import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-funnel-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './funnel-chart.component.html',
  styleUrl: './funnel-chart.component.scss'
})
export class FunnelChartComponent {
  // --- ApexCharts: Postulaciones por Semana ---
  public barChartOptions: any = {
    series: [{
      name: "Postulaciones",
      data: [30, 45, 25, 60, 40, 15, 12]
    }],
    chart: {
      type: "bar",
      height: 180,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: 'var(--text-muted)'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40%"
      }
    },
    dataLabels: { enabled: false },
    colors: ["var(--primary)"],
    xaxis: {
      categories: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: { show: false },
    tooltip: { theme: 'light' }
  };

  // --- ApexCharts: Embudo de Selección ---
  public funnelChartOptions: any = {
    series: [{
      name: "Candidatos",
      data: [143, 89, 24, 7, 5]
    }],
    chart: {
      type: "bar",
      height: 250,
      toolbar: { show: false },
      background: 'transparent',
      foreColor: 'var(--text-muted)'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
        distributed: true
      }
    },
    colors: [
      "var(--primary)",
      "var(--primary-light)",
      "var(--accent)",
      "var(--secondary)",
      "var(--success)"
    ],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: { colors: ['var(--text-main)'] },
      formatter: function(val: any, opt: any) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
      },
      offsetX: 0
    },
    xaxis: {
      categories: ["Recibidas", "Revisadas", "Entrevistas", "Ofertas", "Contratados"],
      labels: { show: false },
      axisBorder: { show: false }
    },
    grid: { show: false },
    legend: { show: false },
    tooltip: { theme: 'light' }
  };
}
