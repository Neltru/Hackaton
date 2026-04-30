import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-stat-card.component.html',
  styleUrl: './company-stat-card.component.scss'
})
export class CompanyStatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() trendValue: string = '';
  @Input() trendText: string = '';
  @Input() progressValue: number = 0; // 0 to 100
  @Input() colorClass: string = 'neutral'; // 'success', 'warning', 'info'
}
