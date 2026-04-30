import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CompanySidebarComponent } from '../components/company-sidebar/company-sidebar.component';

@Component({
  selector: 'app-company-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, CompanySidebarComponent],
  templateUrl: './company-layout.component.html',
  styleUrl: './company-layout.component.scss'
})
export class CompanyLayoutComponent {
  // Simulamos que la empresa actual es de la Zona Norte y tiene convenio automático
  hasAgreement: boolean = true;
}
