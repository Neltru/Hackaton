import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-box company">UT</span>
          <div class="logo-text">
            <span class="main">COMPANY</span>
            <span class="sub">DE LA COSTA</span>
          </div>
        </div>
      </div>

      <!-- BOTÓN DE ACCIÓN RÁPIDA -->
      <div class="quick-action">
        <button class="btn-new-job" routerLink="/company/vacantes/new">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Publicar Vacante
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <label>RECLUTAMIENTO</label>
          <a routerLink="/company/dashboard" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Resumen de Actividad
          </a>
          <a routerLink="/company/vacantes" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Mis Vacantes Activas
          </a>
          <a routerLink="/company/mensajes" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Bandeja de Mensajes
          </a>
        </div>

        <div class="nav-section">
          <label>TALENTO Y REPORTES</label>
          <a routerLink="/company/reportes" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Reportes de Idoneidad
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="avatar company">EM</div>
          <div class="user-info">
            <span class="name">Rios Company</span>
            <span class="role">Reclutador Senior</span>
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
      padding: 2.5rem 1.5rem 1.5rem;
      .logo {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        .logo-box {
          background: var(--primary-gradient);
          color: white;
          padding: 0.6rem;
          border-radius: 12px;
          font-weight: 900;
          font-size: 1.2rem;
          box-shadow: 0 4px 10px rgba(45, 106, 79, 0.2);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          .main { font-weight: 800; font-size: 1.1rem; color: var(--text-main); letter-spacing: 0.5px; }
          .sub { font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        }
      }
    }

    .quick-action {
      padding: 1rem 1.5rem;
      .btn-new-job {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: 14px;
        font-weight: 800;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: var(--shadow-sm);
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
      .nav-section {
        margin-bottom: 2rem;
        label {
          display: block;
          padding: 0 1.5rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 1.5px;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.85rem 1.5rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 600;
        transition: all 0.3s;
        border-left: 4px solid transparent;
        &:hover {
          background: var(--sidebar-hover);
          color: var(--primary);
          padding-left: 1.75rem;
        }
        &.active {
          color: var(--primary);
          background: #f0f7f4;
          border-left-color: var(--primary);
          font-weight: 800;
        }
        svg { opacity: 0.8; stroke: currentColor; }
        &.active svg { opacity: 1; }
      }
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
      .user-pill {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8faf9;
        border-radius: 1.25rem;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          background: #f0f7f4;
          transform: translateY(-2px);
        }

        .avatar {
          width: 40px; height: 40px;
          background: var(--primary-gradient);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 0.9rem; color: white;
          box-shadow: 0 4px 8px rgba(45, 106, 79, 0.15);
        }
        .user-info {
          display: flex; flex-direction: column;
          .name { font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
          .role { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        }
      }
    }
  `]
})
export class CompanySidebarComponent {}
