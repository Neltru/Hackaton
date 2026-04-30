import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle: string = '';
  @Input() progress: number = 0;
  @Input() isProgress: boolean = false;
  @Input() badgeText: string = '';
  @Input() badgeType: 'success' | 'info' | 'warning' | 'neutral' = 'neutral';
}
