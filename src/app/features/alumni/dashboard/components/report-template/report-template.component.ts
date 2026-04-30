import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestResult } from '../../../../../core/services/tests.service';
import { AlumniProfile } from '../../../../../core/models/alumni-profile.models';

@Component({
  selector: 'app-report-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="report-content" class="report-wrapper">
      <header class="pdf-header">
        <div class="logo-area">
          <div class="ut-logo">UT <span>NAYARIT</span></div>
          <div class="ut-sub">DE LA COSTA</div>
        </div>
        <div class="title-area">
          <h1>REPORTE TÉCNICO DE IDONEIDAD</h1>
          <p class="folio">CERTIFICADO DIGITAL: {{ date | date:'yyyy' }}-{{ date | date:'HHmmss' }}</p>
        </div>
      </header>

      <section class="user-hero">
        <div class="user-main">
          <div class="avatar-circle">
            {{ getInitials() }}
          </div>
          <div class="user-details">
            <h2>{{ getFullName() }}</h2>
            <p class="career">{{ profile?.carrera_nombre || 'Técnico Superior Universitario / Ingeniería' }}</p>
          </div>
        </div>
        <div class="meta-info">
          <div class="meta-item">
            <span class="label">FECHA DE EMISIÓN</span>
            <span class="value">{{ date | date:'dd / MM / yyyy' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">ESTADO DE PERFIL</span>
            <span class="value badge">COMPLETADO</span>
          </div>
        </div>
      </section>

      <div class="report-grid">
        <div class="scores-section">
          <h3 class="section-title">DESEMPEÑO POR DIMENSIÓN</h3>
          <div class="scores-container">
            @for (test of tests; track test.id) {
              <div class="score-card">
                <div class="score-header">
                  <span class="dimension-name">{{ test.name }}</span>
                  <span class="dimension-value">{{ test.score || 0 }}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width.%]="test.score || 0"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="analytics-section">
          <div class="analysis-card strength">
            <h3>FORTALEZAS IDENTIFICADAS</h3>
            <ul>
              <li>Resolución de problemas técnicos complejos.</li>
              <li>Pensamiento analítico y estructurado.</li>
              <li>Alta adaptabilidad a entornos tecnológicos.</li>
              <li>Competencia técnica superior al promedio.</li>
            </ul>
          </div>
          
          <div class="analysis-card improvements">
            <h3>PLAN DE MEJORA SUGERIDO</h3>
            <ul>
              <li>Fortalecimiento de liderazgo de proyectos.</li>
              <li>Certificación en metodologías ágiles.</li>
              <li>Expansión de red de contactos industriales.</li>
            </ul>
          </div>
        </div>
      </div>

      <footer class="pdf-footer">
        <div class="footer-top">
          <div class="legal-text">
            <p>Este documento constituye una evaluación técnica oficial emitida por la Universidad Tecnológica de Nayarit. Los resultados reflejan el desempeño del egresado en pruebas estandarizadas de la institución.</p>
          </div>
          <div class="qr-code">
            <div class="qr-box">VALIDADO</div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© {{ date | date:'yyyy' }} UT de la Costa — iTech Nayarit Sistema de Bolsa de Trabajo</span>
          <span>www.utnayarit.edu.mx</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .report-wrapper {
      width: 850px;
      padding: 60px;
      background: white;
      color: #1b4332;
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      position: relative;
    }

    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 4px solid #2d6a4f;
      padding-bottom: 25px;
      margin-bottom: 40px;
    }

    .ut-logo {
      font-weight: 900;
      font-size: 28px;
      color: #2d6a4f;
      letter-spacing: -1px;
      span { color: #d4a017; }
    }
    .ut-sub { font-size: 12px; font-weight: 800; letter-spacing: 3px; color: #52b788; margin-top: -5px; }

    .title-area {
      text-align: right;
      h1 { font-size: 18px; font-weight: 900; margin: 0; color: #1b4332; letter-spacing: 1px; }
      .folio { font-size: 11px; color: #52b788; margin-top: 5px; font-weight: 700; }
    }

    .user-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f0f7f4;
      padding: 30px;
      border-radius: 20px;
      margin-bottom: 40px;
    }

    .user-main {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .avatar-circle {
      width: 80px; height: 80px; background: #2d6a4f; color: white;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 900;
    }

    .user-details {
      h2 { font-size: 24px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
      .career { font-size: 14px; font-weight: 600; color: #52b788; margin: 5px 0 0; }
    }

    .meta-info {
      text-align: right;
      .meta-item {
        margin-bottom: 10px;
        &:last-child { margin-bottom: 0; }
        .label { display: block; font-size: 9px; font-weight: 800; color: #52b788; letter-spacing: 1px; }
        .value { font-size: 14px; font-weight: 800; color: #1b4332; }
        .badge { color: #2d6a4f; }
      }
    }

    .section-title {
      font-size: 14px; font-weight: 900; letter-spacing: 2px; color: #2d6a4f;
      margin-bottom: 25px; border-left: 5px solid #d4a017; padding-left: 15px;
    }

    .scores-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px 40px;
      margin-bottom: 50px;
    }

    .score-card {
      .score-header {
        display: flex; justify-content: space-between; margin-bottom: 10px;
        .dimension-name { font-size: 12px; font-weight: 800; }
        .dimension-value { font-size: 14px; font-weight: 900; color: #2d6a4f; }
      }
      .progress-track { height: 10px; background: #e0eee8; border-radius: 5px; overflow: hidden; }
      .progress-fill { height: 100%; background: #2d6a4f; }
    }

    .analytics-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 30px;
    }

    .analysis-card {
      padding: 25px; border-radius: 15px;
      h3 { font-size: 13px; font-weight: 900; margin-bottom: 15px; letter-spacing: 1px; }
      ul { padding-left: 20px; margin: 0; }
      li { font-size: 13px; margin-bottom: 8px; font-weight: 500; line-height: 1.4; }
      &.strength { background: #e9f5ef; h3 { color: #2d6a4f; } }
      &.improvements { border: 2px dashed #edf2f0; h3 { color: #52b788; } }
    }

    .pdf-footer {
      margin-top: 80px;
      border-top: 2px solid #edf2f0;
      padding-top: 30px;
    }

    .footer-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 30px;
    }

    .legal-text {
      width: 70%;
      p { font-size: 10px; line-height: 1.6; color: #52b788; margin: 0; font-weight: 500; }
    }

    .qr-box {
      width: 80px; height: 80px; border: 2px solid #2d6a4f; color: #2d6a4f;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 900; text-align: center; border-radius: 10px;
    }

    .footer-bottom {
      display: flex; justify-content: space-between;
      font-size: 10px; font-weight: 800; color: #52b788;
    }
  `]
})
export class ReportTemplateComponent {
  @Input() profile: AlumniProfile | null = null;
  @Input() tests: TestResult[] = [];
  date = new Date();

  getFullName(): string {
    if (!this.profile) return 'NOMBRE DEL EGRESADO';
    return `${this.profile.nombre} ${this.profile.apellido_paterno} ${this.profile.apellido_materno || ''}`.toUpperCase();
  }

  getInitials(): string {
    if (!this.profile) return 'UT';
    return (this.profile.nombre[0] + (this.profile.apellido_paterno?.[0] || '')).toUpperCase();
  }
}
