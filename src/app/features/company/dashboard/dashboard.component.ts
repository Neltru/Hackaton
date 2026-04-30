import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyStatCardComponent } from './components/company-stat-card/company-stat-card.component';
import { PublishedJobsComponent } from './components/published-jobs/published-jobs.component';
import { FunnelChartComponent } from './components/funnel-chart/funnel-chart.component';
import { RecentCandidatesComponent } from './components/recent-candidates/recent-candidates.component';
import { RecentNotificationsComponent } from './components/recent-notifications/recent-notifications.component';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CompanyStatCardComponent,
    PublishedJobsComponent,
    FunnelChartComponent,
    RecentCandidatesComponent,
    RecentNotificationsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
}