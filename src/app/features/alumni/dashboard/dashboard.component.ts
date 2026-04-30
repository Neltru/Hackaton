import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { DimensionResultsComponent } from './components/dimension-results/dimension-results.component';
import { CvStatusComponent } from './components/cv-status/cv-status.component';
import { RecommendedJobsComponent } from './components/recommended-jobs/recommended-jobs.component';
import { ApplicationsListComponent } from './components/applications-list/applications-list.component';
import { ReportTemplateComponent } from './components/report-template/report-template.component';
import { TestsService, TestResult } from '../../../core/services/tests.service';
import { AlumniProfileService } from '../../../core/services/alumni-profile.service';
import { PdfReportService } from '../../../core/services/pdf-report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    StatCardComponent, 
    DimensionResultsComponent, 
    CvStatusComponent, 
    RecommendedJobsComponent, 
    ApplicationsListComponent,
    ReportTemplateComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  completedTests = 0;
  totalTests = 4;
  allCompleted = false;

  // Datos para el reporte
  alumniProfile: any;
  allTests: TestResult[] = [];
  isGeneratingPdf = false;
  currentDate = new Date();

  constructor(
    private testsService: TestsService,
    private profileService: AlumniProfileService,
    private pdfService: PdfReportService
  ) {}

  ngOnInit(): void {
    this.testsService.getCompletionStats().subscribe(stats => {
      this.completedTests = stats.completed;
      this.totalTests = stats.total;
    });

    this.testsService.areAllTestsCompleted().subscribe(status => {
      this.allCompleted = status;
    });

    // Cargar datos para el PDF
    this.profileService.getProfile().subscribe(profile => this.alumniProfile = profile);
    this.testsService.getTests().subscribe(tests => this.allTests = tests);
  }

  completeRemainingTests(): void {
    this.testsService.completeProyectiva();
  }

  async downloadReport(): Promise<void> {
    this.isGeneratingPdf = true;
    try {
      await this.pdfService.generateIdoneidadReport('report-content', 'Reporte_Idoneidad_Alumni');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      this.isGeneratingPdf = false;
    }
  }
}
