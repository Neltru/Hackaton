import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-box admin">UT</span>
          <div class="logo-text">
            <span class="main">ADMIN</span>
            <span class="sub">DE LA COSTA</span>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <!-- SECCIÓN 1: CONTROL GENERAL -->
        <div class="nav-section">
          <label>CONTROL CENTRAL</label>
          <a routerLink="/administracion/dashboard" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard Global
          </a>
          <a routerLink="/administracion/evaluaciones" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Evaluaciones SOT
          </a>
          <a routerLink="/administracion/convenios" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
            Gestión de Convenios
          </a>
        </div>

        <!-- SECCIÓN 2: MÉTRICAS Y ANÁLISIS -->
        <div class="nav-section">
          <label>MÉTRICAS Y REPORTES</label>
          <a routerLink="/administracion/indicador-insercion" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            Inserción Laboral
          </a>
          <a routerLink="/administracion/mapa-convenios" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Mapa de Convenios
          </a>
          <a routerLink="/administracion/ranking-competencias" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Ranking Competencias
          </a>
          <a routerLink="/administracion/monitoreo-egresados" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Monitoreo Egresados
          </a>
        </div>

        <!-- SECCIÓN 3: NÚCLEO TÉCNICO -->
        <div class="nav-section">
          <label>NÚCLEO DEL SISTEMA</label>
          <a routerLink="/administracion/sistema/siest-2.0" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Integración SI-EST
          </a>
          <a routerLink="/administracion/sistema/vacantes-nacionales" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Vacantes Nacionales
          </a>
          <a routerLink="/administracion/sistema/drive-docs" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Gestión Drive Docs
          </a>
          <a routerLink="/administracion/sistema/matching" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 16v5h5"/><path d="M4 12H20"/><path d="M12 4V20"/></svg>
            Motor de Matching
          </a>
          <a routerLink="/administracion/sistema/analiticas" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
            Analíticas SOT
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="avatar admin">AD</div>
          <div class="user-info">
            <span class="name">Rios Admin</span>
            <span class="role">Root Admin</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 1.5rem 1.5rem;
      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        .logo-box {
          background: #cc9900;
          color: white;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          .main { font-weight: 700; font-size: 1rem; color: var(--text-main); letter-spacing: 0.5px; }
          .sub { font-size: 0.6rem; color: var(--text-muted); font-weight: 600; }
        }
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 0.5rem 0;
      overflow-y: auto;
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

      .nav-section {
        margin-bottom: 1.5rem;
        label {
          display: block;
          padding: 0 1.5rem;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1.5rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s;
        border-left: 3px solid transparent;

        &:hover {
          background: var(--sidebar-hover);
          color: var(--text-main);
          padding-left: 1.75rem;
        }

        &.active {
          color: #cc9900;
          background: rgba(204, 153, 0, 0.05);
          border-left-color: #cc9900;
          font-weight: 700;
        }

        svg { opacity: 0.7; }
        &.active svg { opacity: 1; }
      }
    }

    .sidebar-footer {
      padding: 1.25rem;
      border-top: 1px solid var(--border-color);
      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 0.75rem;
        .avatar {
          width: 32px; height: 32px;
          background: #cc9900;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.75rem; color: white;
        }
        .user-info {
          display: flex; flex-direction: column;
          .name { font-size: 0.8rem; font-weight: 600; color: var(--text-main); }
          .role { font-size: 0.65rem; color: var(--text-muted); }
        }
      }
    }
  `]
})
export class AdminSidebarComponent {}
