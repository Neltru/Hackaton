import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EvaluacionesService } from '../../../core/services/evaluaciones.service';
import { ResultadoPrueba, PruebaInfo } from '../../../core/models/evaluaciones.models';

@Component({
  selector: 'app-evaluaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './evaluaciones.component.html',
  styleUrl: './evaluaciones.component.scss'
})
export class EvaluacionesComponent implements OnInit {
  isLoading = true;
  resultados: ResultadoPrueba | null = null;
  selectedPrueba: PruebaInfo | null = null;
  mostrarModal = false;

  readonly pruebas: PruebaInfo[] = [
    {
      key: 'puntaje_psicometrico',
      completadoKey: 'psicometrico_completado_at',
      nombre: 'Prueba Psicométrica',
      descripcion: 'Evalúa características de personalidad, actitudes y aptitudes relevantes para el ámbito laboral. Mide dimensiones como liderazgo, trabajo en equipo y adaptabilidad.',
      icono: 'brain',
      duracion: '35–45 min',
      instrucciones: 'Responde con sinceridad. No hay respuestas correctas ni incorrectas. Elige la opción que mejor describa tu forma de ser habitual.'
    },
    {
      key: 'puntaje_cognitivo',
      completadoKey: 'cognitivo_completado_at',
      nombre: 'Prueba Cognitiva',
      descripcion: 'Mide habilidades de razonamiento lógico, atención, memoria de trabajo y velocidad de procesamiento. Predice capacidad de aprendizaje.',
      icono: 'puzzle',
      duracion: '25–30 min',
      instrucciones: 'Trabaja lo más rápido y preciso posible. Lee cada pregunta cuidadosamente antes de responder. El tiempo es un factor evaluado.'
    },
    {
      key: 'puntaje_tecnico',
      completadoKey: 'tecnico_completado_at',
      nombre: 'Prueba Técnica',
      descripcion: 'Evalúa conocimientos y competencias técnicas específicas según carrera (Sistemas / Admin / TI). Solo aplica para carreras habilitadas.',
      icono: 'code',
      duracion: '40–60 min',
      instrucciones: 'Aplica tus conocimientos de la carrera. Puedes usar papel de borrador. Evita consultar apuntes externos durante la prueba.'
    },
    {
      key: 'puntaje_proyectivo',
      completadoKey: 'proyectivo_completado_at',
      nombre: 'Prueba Proyectiva',
      descripcion: 'A través de estímulos visuales y situacionales, analiza la visión personal y profesional a futuro, metas e identificación vocacional.',
      icono: 'target',
      duracion: '20–25 min',
      instrucciones: 'Sé creativo y genuino en tus respuestas. No existe respuesta incorrecta. Explora libremente tus pensamientos sobre el futuro.'
    }
  ];

  constructor(private evaluacionesService: EvaluacionesService) { }

  ngOnInit(): void {
    this.evaluacionesService.getMisResultados().subscribe({
      next: (res) => {
        this.resultados = res;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getPuntaje(prueba: PruebaInfo): number | null {
    if (!this.resultados) return null;
    return (this.resultados as any)[prueba.key] as number | null;
  }

  getFechaCompletado(prueba: PruebaInfo): string | null {
    if (!this.resultados) return null;
    return (this.resultados as any)[prueba.completadoKey] as string | null;
  }

  isCompletada(prueba: PruebaInfo): boolean {
    return this.getFechaCompletado(prueba) !== null;
  }

  getEstado(prueba: PruebaInfo): 'completada' | 'pendiente' {
    return this.isCompletada(prueba) ? 'completada' : 'pendiente';
  }

  getColorPuntaje(puntaje: number | null): string {
    if (puntaje === null) return '#444444';
    if (puntaje >= 85) return '#65a363';
    if (puntaje >= 70) return '#4f8cf6';
    if (puntaje >= 50) return '#f5b041';
    return '#e74c3c';
  }

  getNivelPuntaje(puntaje: number | null): string {
    if (puntaje === null) return 'Sin realizar';
    if (puntaje >= 85) return 'Sobresaliente';
    if (puntaje >= 70) return 'Alto';
    if (puntaje >= 50) return 'Medio';
    return 'Bajo';
  }

  getTotalCompletadas(): number {
    return this.pruebas.filter(p => this.isCompletada(p)).length;
  }

  getPromedioGeneral(): number | null {
    const completadas = this.pruebas.filter(p => this.isCompletada(p));
    if (completadas.length === 0) return null;
    const suma = completadas.reduce((acc, p) => acc + (this.getPuntaje(p) ?? 0), 0);
    return Math.round(suma / completadas.length);
  }

  abrirModal(prueba: PruebaInfo): void {
    this.selectedPrueba = prueba;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.selectedPrueba = null;
  }

  iniciarPrueba(prueba: PruebaInfo): void {
    this.evaluacionesService.iniciarPrueba(prueba.key).subscribe({
      next: ({ url }) => {
        if (url && url !== '#') window.open(url, '_blank');
        this.cerrarModal();
      }
    });
  }
}
