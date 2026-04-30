import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import { API_CONFIG } from '../constants/api.constants';
import { MOCK_TESTS } from '../mocks/alumni-mock.data';

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
  private readonly apiUrl = `${API_CONFIG.baseUrl}/alumni/pruebas/resultados`;

  // Estado inicial con datos simulados (mock)
  private readonly tests$ = new BehaviorSubject<TestResult[]>(MOCK_TESTS);

  constructor(private readonly http: HttpClient) { }

  getTests(): Observable<TestResult[]> {
    this.refreshTests().subscribe();
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
    this.tests$.next(updatedTests); // Optimistic UI

    this.http.post(this.apiUrl, {
      id,
      score
    }).pipe(
      catchError(() => of(null))
    ).subscribe(() => this.refreshTests().subscribe());
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

  private refreshTests(): Observable<TestResult[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        const rows = response?.data || response?.resultados || response || [];
        if (!Array.isArray(rows)) return this.getDefaultTests();

        const mapped = rows.map((item: any) => this.toTestResult(item));
        return this.mergeWithDefaults(mapped);
      }),
      tap((tests) => this.tests$.next(tests)),
      catchError(() => of(MOCK_TESTS))
    );
  }

  private toTestResult(item: any): TestResult {
    const id = this.normalizeTestId(item.id || item.test_id || item.tipo || item.category);
    return {
      id,
      name: item.name || item.nombre || this.getDefaultName(id),
      category: this.toCategory(item.category || item.categoria || id),
      completed: Boolean(item.completed ?? item.completada ?? item.score != null),
      score: item.score != null ? Number(item.score) : undefined,
      completedAt: item.completedAt || item.completed_at || item.fecha ? new Date(item.completedAt || item.completed_at || item.fecha) : undefined,
      description: item.description || item.descripcion || this.getDefaultDescription(id)
    };
  }

  private mergeWithDefaults(incoming: TestResult[]): TestResult[] {
    const defaults = this.getDefaultTests();
    const byId = new Map(incoming.map((t) => [t.id, t]));
    return defaults.map((base) => byId.get(base.id) ? { ...base, ...byId.get(base.id)! } : base);
  }

  private getDefaultTests(): TestResult[] {
    return [
      {
        id: 'psico',
        name: 'Evaluación Psicométrica',
        category: 'Psicométrica',
        completed: false,
        description: 'Rasgos de personalidad y trabajo en equipo.'
      },
      {
        id: 'cogni',
        name: 'Prueba Cognitiva',
        category: 'Cognitiva',
        completed: false,
        description: 'Potencial de aprendizaje y razonamiento lógico.'
      },
      {
        id: 'tech',
        name: 'Examen Técnico de Carrera',
        category: 'Técnica',
        completed: false,
        description: 'Conocimientos específicos de tu área profesional.'
      },
      {
        id: 'proy',
        name: 'Prueba Proyectiva',
        category: 'Proyectiva',
        completed: false,
        description: 'Estabilidad emocional y rasgos profundos de personalidad.'
      }
    ];
  }

  private normalizeTestId(raw: string): string {
    const value = String(raw || '').toLowerCase();
    if (value.includes('psico')) return 'psico';
    if (value.includes('cog')) return 'cogni';
    if (value.includes('tec')) return 'tech';
    if (value.includes('proy')) return 'proy';
    return value || 'psico';
  }

  private toCategory(raw: string): TestResult['category'] {
    const value = String(raw || '').toLowerCase();
    if (value.includes('psico')) return 'Psicométrica';
    if (value.includes('cog')) return 'Cognitiva';
    if (value.includes('tec')) return 'Técnica';
    return 'Proyectiva';
  }

  private getDefaultName(id: string): string {
    const names: Record<string, string> = {
      psico: 'Evaluación Psicométrica',
      cogni: 'Prueba Cognitiva',
      tech: 'Examen Técnico de Carrera',
      proy: 'Prueba Proyectiva'
    };
    return names[id] || 'Prueba';
  }

  private getDefaultDescription(id: string): string {
    const descriptions: Record<string, string> = {
      psico: 'Rasgos de personalidad y trabajo en equipo.',
      cogni: 'Potencial de aprendizaje y razonamiento lógico.',
      tech: 'Conocimientos específicos de tu área profesional.',
      proy: 'Estabilidad emocional y rasgos profundos de personalidad.'
    };
    return descriptions[id] || 'Prueba profesional.';
  }
}
