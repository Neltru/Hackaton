import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface TestResult {
  id: string;
  name: string;
  category: 'Psicométrica' | 'Cognitiva' | 'Técnica' | 'Proyectiva';
  completed: boolean;
  score?: number;
  completedAt?: Date;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  // Estado inicial simulando que ya hizo 3 de 4 pruebas tras registrarse
  private readonly tests$ = new BehaviorSubject<TestResult[]>([
    {
      id: 'psico',
      name: 'Evaluación Psicométrica',
      category: 'Psicométrica',
      completed: true,
      score: 88,
      completedAt: new Date('2024-04-20'),
      description: 'Rasgos de personalidad y trabajo en equipo.'
    },
    {
      id: 'cogni',
      name: 'Prueba Cognitiva',
      category: 'Cognitiva',
      completed: true,
      score: 91,
      completedAt: new Date('2024-04-20'),
      description: 'Potencial de aprendizaje y razonamiento lógico.'
    },
    {
      id: 'tech',
      name: 'Examen Técnico de Carrera',
      category: 'Técnica',
      completed: true,
      score: 85,
      completedAt: new Date('2024-04-21'),
      description: 'Conocimientos específicos de tu área profesional.'
    },
    {
      id: 'proy',
      name: 'Prueba Proyectiva',
      category: 'Proyectiva',
      completed: false,
      description: 'Estabilidad emocional y rasgos profundos de personalidad.'
    }
  ]);

  getTests(): Observable<TestResult[]> {
    return this.tests$.asObservable();
  }

  getPendingTests(): Observable<TestResult[]> {
    return this.tests$.pipe(
      map(tests => tests.filter(t => !t.completed))
    );
  }

  areAllTestsCompleted(): Observable<boolean> {
    return this.tests$.pipe(
      map(tests => tests.every(t => t.completed))
    );
  }

  saveTestResult(id: string, score: number): void {
    const currentTests = this.tests$.value;
    const test = currentTests.find(t => t.id === id);

    // Regla de oro: No repetible si ya está completada
    if (test && test.completed) {
      console.warn(`La prueba ${id} ya fue completada y no puede repetirse.`);
      return;
    }

    const updatedTests = currentTests.map(t =>
      t.id === id
        ? { ...t, completed: true, score, completedAt: new Date() }
        : t
    );
    this.tests$.next(updatedTests);

    // Aquí persistiríamos en localStorage o API real
    localStorage.setItem('alumni_tests_results', JSON.stringify(updatedTests));
  }

  getCompletionStats(): Observable<{ completed: number, total: number }> {
    return this.tests$.pipe(
      map(tests => ({
        completed: tests.filter(t => t.completed).length,
        total: tests.length
      }))
    );
  }

  completeProyectiva(): void {
    this.saveTestResult('proy', 85);
  }
}
