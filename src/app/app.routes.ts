import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { AlumniLayoutComponent } from './core/layout/alumni-layout/alumni-layout.component';
import { DashboardComponent as AlumniDashboardComponent } from './features/alumni/dashboard/dashboard.component';
import { VacantesComponent } from './features/alumni/vacantes/vacantes.component';
import { CompanyLayoutComponent } from './core/layout/company-layout/company-layout.component';
import { DashboardComponent as CompanyDashboardComponent } from './features/company/dashboard/dashboard.component';
import { PerfilComponent } from './features/alumni/perfil/perfil.component';
import { PruebasComponent } from './features/alumni/pruebas/pruebas.component';

export const routes: Routes = [
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
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
