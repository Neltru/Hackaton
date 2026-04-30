import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alumni-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-box">UT</span>
          <div class="logo-text">
            <span class="main">ALUMNO</span>
            <span class="sub"><span class="highlight">DE LA</span> COSTA</span>
          </div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <label>PRINCIPAL</label>
          <a routerLink="/alumni/dashboard" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Dashboard
          </a>
          <a routerLink="/alumni/vacantes" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Bolsa de Trabajo
          </a>
          <a routerLink="/alumni/postulaciones" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Mis Postulaciones
          </a>
        </div>

        <div class="nav-section">
          <label>PERFIL PROFESIONAL</label>
          <a routerLink="/alumni/pruebas" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Mis Evaluaciones
          </a>
          <a routerLink="/alumni/perfil" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Mi Perfil
          </a>
          <a routerLink="/alumni/mi-cv" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Mi CV
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="avatar">RN</div>
          <div class="user-info">
            <span class="name">Rios N.</span>
            <span class="role">Egresado</span>
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
      box-shadow: 4px 0 24px rgba(0, 74, 67, 0.03);
    }

    .sidebar-header {
      padding: 2.5rem 1.5rem;
      .logo {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        
        .logo-box {
          background: var(--primary-gradient);
          color: white;
          padding: 0.6rem;
          border-radius: 0.75rem;
          font-weight: 800;
          font-size: 1.3rem;
          box-shadow: 0 4px 12px rgba(0, 74, 67, 0.2);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
          .main { font-weight: 800; font-size: 1.2rem; color: var(--primary); letter-spacing: 0.5px; }
          .sub { 
            font-size: 0.7rem; 
            color: var(--text-muted); 
            font-weight: 700; 
            text-transform: uppercase;
            .highlight { color: var(--secondary); }
          }
        }
      }
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;

      .nav-section {
        margin-bottom: 2.5rem;
        label {
          display: block;
          padding: 0 1.75rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          opacity: 0.6;
        }
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.85rem 1.75rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.95rem;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-left: 4px solid transparent;

        &:hover {
          background: var(--sidebar-hover);
          color: var(--primary);
          padding-left: 2rem;
        }

        &.active {
          color: var(--primary);
          background: #f0f7f4;
          border-left: 4px solid var(--primary);
          font-weight: 700;
          svg { stroke: var(--primary); }
        }

        svg { 
          opacity: 0.8; 
          transition: all 0.3s;
          stroke: currentColor;
        }
        &:hover svg { transform: translateX(2px); }
      }
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);

      .user-pill {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 1rem;
        background: #f0f7f4;
        border-radius: 1.25rem;
        transition: all 0.2s;
        cursor: pointer;

        &:hover {
          background: #e9f5ee;
          transform: translateY(-2px);
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: var(--primary-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: white;
          box-shadow: 0 4px 8px rgba(45, 106, 79, 0.15);
        }

        .user-info {
          display: flex;
          flex-direction: column;
          .name { font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
          .role { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
        }
      }
    }
  `]
})
export class AlumniSidebarComponent { }
