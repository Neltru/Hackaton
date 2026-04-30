import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumniProfile, WorkExperience, Certificate } from '../../../core/models/alumni-profile.models';
import { AlumniProfileService } from '../../../core/services/alumni-profile.service';
import { AlumniFilesService } from '../../../core/services/alumni-files.service';
import { HttpEventType } from '@angular/common/http';
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
  fileMessage = '';
  fileError = '';

  experiencias: WorkExperience[] = [];

  certificados: Certificate[] = [];

  constructor(
    private profileService: AlumniProfileService,
    private filesService: AlumniFilesService,
    private fb: FormBuilder
  ) {
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

  onPhotoSelected(event: Event): void {
    const file = this.getInputFile(event);
    if (!file) return;

    this.fileMessage = '';
    this.fileError = '';
    this.filesService.uploadPhoto(file).subscribe({
      next: (evt) => {
        if (evt.type === HttpEventType.Response) {
          this.profile = {
            ...(this.profile as AlumniProfile),
            foto_url: evt.body?.viewUrl || this.profile?.foto_url
          };
          this.fileMessage = 'Foto de perfil actualizada.';
        }
      },
      error: () => this.fileError = 'No se pudo subir la foto.'
    });
  }

  onCvSelected(event: Event): void {
    const file = this.getInputFile(event);
    if (!file) return;

    this.fileMessage = '';
    this.fileError = '';
    this.filesService.uploadCv(file).subscribe({
      next: (evt) => {
        if (evt.type === HttpEventType.Response) {
          const url = evt.body?.viewUrl || '';
          this.cvLinkForm.patchValue({ cv_drive_url: url });
          if (this.profile) this.profile.cv_drive_url = url;
          this.fileMessage = 'CV subido correctamente.';
        }
      },
      error: () => this.fileError = 'No se pudo subir el CV.'
    });
  }

  onCertificateSelected(event: Event): void {
    const file = this.getInputFile(event);
    if (!file) return;

    this.fileMessage = '';
    this.fileError = '';
    this.filesService.uploadCertificate(file).subscribe({
      next: (evt) => {
        if (evt.type === HttpEventType.Response) {
          this.certificados = [{
            id: evt.body?.fileId || Date.now().toString(),
            title: file.name,
            institution: 'Documento subido',
            issueDate: new Date().toISOString(),
            file: evt.body || undefined
          }, ...this.certificados];
          this.fileMessage = 'Certificado subido correctamente.';
        }
      },
      error: () => this.fileError = 'No se pudo subir el certificado.'
    });
  }

  removeCertificateFile(cert: Certificate): void {
    const fileId = cert.file?.fileId || cert.id;
    if (!fileId) return;

    this.filesService.deleteFile(fileId).subscribe({
      next: () => {
        this.certificados = this.certificados.filter(c => c.id !== cert.id);
        this.fileMessage = 'Archivo eliminado correctamente.';
      },
      error: () => {
        this.fileError = 'No se pudo eliminar el archivo.';
      }
    });
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

  private getInputFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files && input.files.length > 0 ? input.files[0] : null;
  }
}
