import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

// ─── Alumni ─────────────────────────────────────────────────────────────────────
import { AlumniLayoutComponent } from './core/layout/alumni-layout/alumni-layout.component';
import { DashboardComponent } from './features/alumni/dashboard/dashboard.component';
import { VacantesComponent } from './features/alumni/vacantes/vacantes.component';

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

  // ── Módulo Alumni ────────────────────────────────────────────────────────────
  {
    path: 'alumni',
    component: AlumniLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vacantes',  component: VacantesComponent  },
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' }
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
      { path: '',             redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Fallback ─────────────────────────────────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
