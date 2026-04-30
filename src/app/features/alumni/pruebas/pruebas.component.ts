import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestsService, TestResult } from '../../../core/services/tests.service';

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss'
})
export class PruebasComponent implements OnInit {
  tests: TestResult[] = [];
  selectedTest: TestResult | null = null;
  isTakingTest = false;
  testProgress = 0;

  constructor(private testsService: TestsService) { }

  ngOnInit(): void {
    this.testsService.getTests().subscribe(data => {
      this.tests = data;
    });
  }

  startTest(test: TestResult): void {
    if (test.completed) return;
    this.selectedTest = test;
    this.isTakingTest = true;
    this.testProgress = 0;
  }

  completeTest(): void {
    if (!this.selectedTest) return;

    // Simular progreso
    const interval = setInterval(() => {
      this.testProgress += 10;
      if (this.testProgress >= 100) {
        clearInterval(interval);
        this.testsService.saveTestResult(this.selectedTest!.id, Math.floor(Math.random() * 20) + 80);
        this.isTakingTest = false;
        this.selectedTest = null;
      }
    }, 200);
  }

  cancelTest(): void {
    this.isTakingTest = false;
    this.selectedTest = null;
  }
}
