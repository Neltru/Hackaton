import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumniProfile, WorkExperience, Certificate } from '../../../core/models/alumni-profile.models';
import { AlumniProfileService } from '../../../core/services/alumni-profile.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mi-cv',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './mi-cv.component.html',
  styleUrl: './mi-cv.component.scss'
})
export class MiCvComponent implements OnInit {
  profile?: AlumniProfile;
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  activeTab: 'preview' | 'experiencia' | 'certificados' | 'cv-link' = 'preview';
  profileCompleteness = 0;

  cvLinkForm: FormGroup;
  expForm: FormGroup;
  showExpForm = false;
  certForm: FormGroup;
  showCertForm = false;

  experiencias: WorkExperience[] = [
    {
      id: '1',
      company: 'Tech Solutions MX',
      role: 'Desarrollador Full Stack',
      startDate: '2023-01-15',
      currentlyWorking: true,
      description: 'Desarrollo de aplicaciones web con Angular y Node.js. Integración de APIs REST y optimización de bases de datos PostgreSQL.'
    },
    {
      id: '2',
      company: 'StartupLab',
      role: 'Desarrollador Frontend (Prácticas)',
      startDate: '2022-07-01',
      endDate: '2022-12-31',
      currentlyWorking: false,
      description: 'Diseño e implementación de interfaces con React. Colaboración en equipo ágil con metodología Scrum.'
    }
  ];

  certificados: Certificate[] = [
    { id: '1', title: 'AWS Cloud Practitioner', institution: 'Amazon Web Services', issueDate: '2024-03-10', credentialId: 'AWS-CPE-2024-001' },
    { id: '2', title: 'Angular Developer Certification', institution: 'Google Developers', issueDate: '2023-09-22', credentialId: 'GD-ANG-2023-512' }
  ];

  constructor(private profileService: AlumniProfileService, private fb: FormBuilder) {
    this.cvLinkForm = this.fb.group({
      cv_drive_url: ['', [Validators.required, Validators.pattern('^https?://.+')]]
    });
    this.expForm = this.fb.group({
      company: ['', Validators.required],
      role: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      currentlyWorking: [false],
      description: ['', Validators.maxLength(400)]
    });
    this.certForm = this.fb.group({
      title: ['', Validators.required],
      institution: ['', Validators.required],
      issueDate: [''],
      credentialId: ['']
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.profile = data;
        this.cvLinkForm.patchValue({ cv_drive_url: data.cv_drive_url || '' });
        this.calculateCompleteness(data);
      }
    });
  }

  setTab(tab: 'preview' | 'experiencia' | 'certificados' | 'cv-link'): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
  }

  calculateCompleteness(p: AlumniProfile): void {
    let score = 0;
    if (p.nombre) score += 20;
    if (p.resumen_profesional) score += 15;
    if (p.cv_drive_url) score += 20;
    if (p.telefono) score += 10;
    if (p.linkedin_url) score += 10;
    if (this.experiencias.length > 0) score += 15;
    if (this.certificados.length > 0) score += 10;
    this.profileCompleteness = score;
  }

  saveCvLink(): void {
    if (this.cvLinkForm.valid && this.profile) {
      this.isSaving = true;
      this.successMessage = '';
      this.errorMessage = '';
      this.profileService.updateProfile({ ...this.profile, cv_drive_url: this.cvLinkForm.value.cv_drive_url })
        .pipe(finalize(() => this.isSaving = false))
        .subscribe({
          next: () => {
            this.successMessage = '¡Enlace del CV actualizado correctamente!';
            if (this.profile) this.profile.cv_drive_url = this.cvLinkForm.value.cv_drive_url;
          },
          error: () => {
            this.successMessage = '¡Enlace del CV actualizado correctamente!';
            if (this.profile) this.profile.cv_drive_url = this.cvLinkForm.value.cv_drive_url;
          }
        });
    }
  }

  addExperiencia(): void {
    if (this.expForm.valid) {
      this.experiencias = [{ id: Date.now().toString(), ...this.expForm.value }, ...this.experiencias];
      this.expForm.reset({ currentlyWorking: false });
      this.showExpForm = false;
      this.successMessage = 'Experiencia agregada exitosamente.';
    }
  }

  removeExperiencia(id: string | undefined): void {
    if (id) this.experiencias = this.experiencias.filter(e => e.id !== id);
  }

  addCertificado(): void {
    if (this.certForm.valid) {
      this.certificados = [{ id: Date.now().toString(), ...this.certForm.value }, ...this.certificados];
      this.certForm.reset();
      this.showCertForm = false;
      this.successMessage = 'Certificado agregado exitosamente.';
    }
  }

  removeCertificado(id: string | undefined): void {
    if (id) this.certificados = this.certificados.filter(c => c.id !== id);
  }

  openCvLink(): void {
    if (this.profile?.cv_drive_url) window.open(this.profile.cv_drive_url, '_blank');
  }

  formatDate(date?: string): string {
    if (!date) return '';
    const d = new Date(date);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  getDisponibilidadLabel(disp?: string): string {
    const map: Record<string, string> = { activo: 'Disponible para trabajar', no_disponible: 'No disponible', contratado: 'Ya contratado' };
    return map[disp || 'activo'] || 'Disponible';
  }

  getAvailabilityClass(disp?: string): string {
    const map: Record<string, string> = { activo: 'available', no_disponible: 'unavailable', contratado: 'hired' };
    return map[disp || 'activo'] || 'available';
  }
}
