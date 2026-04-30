import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { DimensionResultsComponent } from './components/dimension-results/dimension-results.component';
import { CvStatusComponent } from './components/cv-status/cv-status.component';
import { RecommendedJobsComponent } from './components/recommended-jobs/recommended-jobs.component';
import { ApplicationsListComponent } from './components/applications-list/applications-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    StatCardComponent, 
    DimensionResultsComponent, 
    CvStatusComponent, 
    RecommendedJobsComponent, 
    ApplicationsListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
