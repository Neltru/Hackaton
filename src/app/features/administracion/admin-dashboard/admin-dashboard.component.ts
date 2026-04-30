import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface KpiCard {
  label: string;
  value: string | number;
  desc: string;
  icon: string | SafeHtml;
  color: string;
}

interface QuickLink {
  label: string;
  desc: string;
  route: string;
  icon: string | SafeHtml;
}

interface ActivityItem {
  icon: string;
  text: string;
  time: string;
  type: 'convenio' | 'evaluacion' | 'postulacion' | 'alerta';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  currentDate = new Date();

  kpis: KpiCard[] = [
    {
      label: 'Convenios activos',
      value: 48,
      desc: '+3 este mes',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      color: '#2d6a4f'
    },
    {
      label: 'Egresados activos',
      value: 340,
      desc: 'con perfil registrado',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      color: '#52b788'
    },
    {
      label: 'Inserción laboral',
      value: '64%',
      desc: 'Meta: 70% — 6% brecha',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      color: '#ffb800'
    },
    {
      label: 'Por vencer (60 días)',
      value: 5,
      desc: 'convenios requieren renovación',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      color: '#ef4444'
    }
  ];

  quickLinks: QuickLink[] = [
    { label: 'Gestión de Convenios', desc: 'Ver y administrar convenios institucionales', route: '/administracion/convenios', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>` },
    { label: 'Reporte de Estatus', desc: 'Pendientes de formalización y por vencer', route: '/administracion/reportes/convenios', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>` },
    { label: 'Inserción Laboral', desc: 'Indicadores de inserción por carrera', route: '/administracion/indicador-insercion', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>` },
    { label: 'Mapa de Convenios', desc: 'Zona norte Nayarit vs nacional', route: '/administracion/mapa-convenios', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>` },
    { label: 'Ranking Competencias', desc: 'Habilidades técnicas y blandas', route: '/administracion/ranking-competencias', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>` },
    { label: 'Monitoreo de Egresados', desc: 'Histograma y campana de Gauss', route: '/administracion/monitoreo-egresados', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
    { label: 'Evaluaciones', desc: 'Pruebas psicométrica, cognitiva y más', route: '/administracion/evaluaciones', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>` },
  ];

  activity: ActivityItem[] = [
    { icon: '📄', text: 'Constructora Orion — convenio pendiente de formalización (18 días)', time: 'Hoy, 09:14', type: 'alerta' },
    { icon: '✅', text: 'Nuevo convenio firmado con TechnoSoft CDMX', time: 'Ayer, 15:30', type: 'convenio' },
    { icon: '📊', text: 'Evaluación psicométrica completada — 12 alumnos', time: 'Ayer, 11:00', type: 'evaluacion' },
    { icon: '⚠️', text: 'Logística del Pacífico — vence en 46 días', time: '28 abr, 08:45', type: 'alerta' },
    { icon: '🎓', text: 'Luis Pérez contratado en Ing. Civil · Constructora Orion', time: '27 abr, 10:22', type: 'postulacion' },
    { icon: '📄', text: 'Reporte mensual de inserción generado (PDF)', time: '25 abr, 16:00', type: 'convenio' },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.sanitizeIcons();
  }

  private sanitizeIcons(): void {
    this.kpis = this.kpis.map(kpi => ({
      ...kpi,
      icon: this.sanitizer.bypassSecurityTrustHtml(kpi.icon as string)
    }));

    this.quickLinks = this.quickLinks.map(link => ({
      ...link,
      icon: this.sanitizer.bypassSecurityTrustHtml(link.icon as string)
    }));
  }
}
