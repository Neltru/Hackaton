import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { AlumniLayoutComponent } from './core/layout/alumni-layout/alumni-layout.component';
import { DashboardComponent } from './features/alumni/dashboard/dashboard.component';
import { VacantesComponent } from './features/alumni/vacantes/vacantes.component';
import { PerfilComponent } from './features/alumni/perfil/perfil.component';
import { PruebasComponent } from './features/alumni/pruebas/pruebas.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { 
    path: 'alumni', 
    component: AlumniLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vacantes', component: VacantesComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'pruebas', component: PruebasComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
