import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestResult } from '../../../../../core/services/tests.service';

@Component({
  selector: 'app-report-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="report-content" class="report-wrapper">
      <header class="pdf-header">
        <div class="logo-area">
          <!-- Placeholder para el logo UT de la Costa -->
          <div class="ut-logo">UT <span>DE LA COSTA</span></div>
        </div>
        <div class="title-area">
          <h1>REPORTE DE IDONEIDAD PROFESIONAL</h1>
          <p class="folio">Folio: 2024-ALU-{{ date | date:'HHmmss' }}</p>
        </div>
      </header>

      <section class="user-info">
        <div class="info-group">
          <label>Nombre del Egresado:</label>
          <p>{{ profile?.fullName }}</p>
        </div>
        <div class="info-group">
          <label>Carrera:</label>
          <p>Técnico Superior Universitario / Ingeniería</p>
        </div>
        <div class="info-group">
          <label>Fecha de Emisión:</label>
          <p>{{ date | date:'longDate' }}</p>
        </div>
      </section>

      <div class="grid-layout">
        <div class="competence-results">
          <h3>Puntajes por Dimensión</h3>
          @for (test of tests; track test.id) {
            <div class="score-row">
              <span class="label">{{ test.name }}</span>
              <div class="bar-container">
                <div class="bar" [style.width.%]="test.score || 0"></div>
              </div>
              <span class="value">{{ test.score || 0 }}/100</span>
            </div>
          }
        </div>
      </div>

      <div class="analysis-section">
        <div class="analysis-box strength">
          <h3>Principales Fortalezas</h3>
          <ul>
            <li>Alta capacidad de resolución de problemas técnicos.</li>
            <li>Pensamiento lógico-estructurado superior al promedio.</li>
            <li>Adaptabilidad a entornos de alta presión.</li>
          </ul>
        </div>
        <div class="analysis-box opportunities">
          <h3>Áreas de Oportunidad</h3>
          <ul>
            <li>Desarrollo de habilidades de liderazgo de equipos.</li>
            <li>Profundización en certificaciones de industria específica.</li>
          </ul>
        </div>
      </div>

      <footer class="pdf-footer">
        <p>Este documento es una representación oficial de las competencias del egresado basada en pruebas estandarizadas de la UT de la Costa.</p>
        <div class="qr-placeholder">CÓDIGO DE VERIFICACIÓN DIGITAL</div>
      </footer>
    </div>
  `,
  styles: [`
    .report-wrapper {
      width: 800px;
      padding: 40px;
      background: white;
      color: #1a1a1a;
      font-family: 'Helvetica', sans-serif;
      border: 1px solid #eee;
    }
    .pdf-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #004a99;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .ut-logo {
      font-weight: 800;
      font-size: 24px;
      color: #004a99;
      span { color: #cc9900; }
    }
    .title-area {
      text-align: right;
      h1 { font-size: 20px; margin: 0; color: #333; }
      .folio { font-size: 12px; color: #666; margin: 5px 0 0; }
    }
    .user-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 40px;
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
    }
    .info-group {
      label { display: block; font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
      p { margin: 0; font-size: 14px; font-weight: 600; color: #000; }
    }
    .score-row {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      .label { width: 180px; font-size: 13px; font-weight: 500; }
      .bar-container { flex: 1; height: 12px; background: #eee; border-radius: 6px; overflow: hidden; }
      .bar { height: 100%; background: #004a99; }
      .value { width: 60px; font-size: 13px; font-weight: 700; text-align: right; }
    }
    .analysis-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 40px;
    }
    .analysis-box {
      padding: 20px;
      border-radius: 12px;
      h3 { font-size: 16px; margin: 0 0 15px 0; }
      ul { margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.6; }
      &.strength { background: #e6f4ea; h3 { color: #1e7e34; } }
      &.opportunities { background: #fff4e5; h3 { color: #856404; } }
    }
    .pdf-footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      p { font-size: 10px; color: #999; }
      .qr-placeholder { font-size: 9px; color: #ccc; margin-top: 10px; letter-spacing: 2px; }
    }
  `]
})
export class ReportTemplateComponent {
  @Input() profile: any;
  @Input() tests: TestResult[] = [];
  date = new Date();
}
