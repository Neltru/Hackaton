import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

// ─── Alumni ─────────────────────────────────────────────────────────────────────
import { AlumniLayoutComponent } from './core/layout/alumni-layout/alumni-layout.component';
import { DashboardComponent as AlumniDashboardComponent } from './features/alumni/dashboard/dashboard.component';
import { VacantesComponent } from './features/alumni/vacantes/vacantes.component';
import { CompanyLayoutComponent } from './core/layout/company-layout/company-layout.component';
import { DashboardComponent as CompanyDashboardComponent } from './features/company/dashboard/dashboard.component';
import { PerfilComponent } from './features/alumni/perfil/perfil.component';
import { PruebasComponent } from './features/alumni/pruebas/pruebas.component';

// ─── Administración ──────────────────────────────────────────────────────────────
import { AdminLayoutComponent } from './core/layout/admin-layout/admin-layout.component';
import { EvaluacionesComponent } from './features/administracion/evaluaciones/evaluaciones.component';
import { ConveniosComponent } from './features/administracion/convenios/convenios.component';
import { ReporteConveniosComponent } from './features/administracion/reporte-convenios/reporte-convenios.component';
import { InsercionLaboralComponent } from './features/administracion/insercion-laboral/insercion-laboral.component';
import { MapaConveniosComponent } from './features/administracion/mapa-convenios/mapa-convenios.component';
import { RankingCompetenciasComponent } from './features/administracion/ranking-competencias/ranking-competencias.component';
import { MonitoreoEgresadosComponent } from './features/administracion/monitoreo-egresados/monitoreo-egresados.component';
import { AdminDashboardComponent } from './features/administracion/admin-dashboard/admin-dashboard.component';

// ─── Transversal / Sistema ──────────────────────────────────────────────────────
import { SiestIntegracionComponent } from './features/transversal/siest-integracion/siest-integracion.component';
import { VacantesNacionalesComponent } from './features/transversal/vacantes-nacionales/vacantes-nacionales.component';
import { DriveGestionComponent } from './features/transversal/drive-gestion/drive-gestion.component';
import { GlobalAnalyticsComponent } from './features/transversal/global-analytics/global-analytics.component';
import { PruebasSotComponent } from './features/transversal/pruebas-sot/pruebas-sot.component';
import { MatchingMotorComponent } from './features/transversal/matching-motor/matching-motor.component';

export const routes: Routes = [
  // ── Auth ────────────────────────────────────────────────────────────────────
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'alumni',
    component: AlumniLayoutComponent,
    children: [
      { path: 'dashboard', component: AlumniDashboardComponent },
      { path: 'vacantes', component: VacantesComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'pruebas', component: PruebasComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'company',
    component: CompanyLayoutComponent,
    children: [
      { path: 'dashboard', component: CompanyDashboardComponent },
      { path: 'vacantes', loadComponent: () => import('./features/company/vacantes/vacantes-list/vacantes-list.component').then(m => m.VacantesListComponent) },
      { path: 'vacantes/new', loadComponent: () => import('./features/company/vacantes/vacante-form/vacante-form.component').then(m => m.VacanteFormComponent) },
      { path: 'vacantes/edit/:id', loadComponent: () => import('./features/company/vacantes/vacante-form/vacante-form.component').then(m => m.VacanteFormComponent) },
      { path: 'vacantes/:id/candidatos', loadComponent: () => import('./features/company/vacantes/vacante-candidatos/vacante-candidatos.component').then(m => m.VacanteCandidatosComponent) },
      { path: 'mensajes', loadComponent: () => import('./features/company/mensajes/mensajes.component').then(m => m.MensajesComponent) },
      { path: 'reportes', loadComponent: () => import('./features/company/reportes/reportes.component').then(m => m.ReportesComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Módulo Administración ────────────────────────────────────────────────────
  {
    path: 'administracion',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'evaluaciones', component: EvaluacionesComponent },
      { path: 'convenios', component: ConveniosComponent },
      { path: 'reportes/convenios', component: ReporteConveniosComponent },
      { path: 'indicador-insercion', component: InsercionLaboralComponent },
      { path: 'mapa-convenios', component: MapaConveniosComponent },
      { path: 'ranking-competencias', component: RankingCompetenciasComponent },
      { path: 'monitoreo-egresados', component: MonitoreoEgresadosComponent },
      { path: 'sistema/siest-2.0', component: SiestIntegracionComponent },
      { path: 'sistema/vacantes-nacionales', component: VacantesNacionalesComponent },
      { path: 'sistema/drive-docs', component: DriveGestionComponent },
      { path: 'sistema/analiticas', component: GlobalAnalyticsComponent },
      { path: 'sistema/pruebas-sot', component: PruebasSotComponent },
      { path: 'sistema/matching', component: MatchingMotorComponent },
      // próximamente: postulaciones, alumnos, vacantes
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Fallback ─────────────────────────────────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
