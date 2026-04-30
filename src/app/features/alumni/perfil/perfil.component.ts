import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, startWith } from 'rxjs/operators';
import {
  AlumniProfile,
  AlumniProfileUpdate,
  Certificate,
  DriveFileRef,
  WorkExperience
} from '../../../core/models/alumni-profile.models';
import { AlumniFilesService } from '../../../core/services/alumni-files.service';
import { AlumniProfileService } from '../../../core/services/alumni-profile.service';
import { InstitutionalEmailInfo, deriveCareerFromInstitutionalEmail } from '../../../core/utils/career-mapper';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  readonly maxFileSizeMb = 5;
  readonly imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  readonly cvTypes = ['application/pdf'];
  readonly certTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

  profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(5)]],
    institutionalEmail: ['', [Validators.required, Validators.email]],
    personalEmail: ['', [Validators.email]],
    phone: [''],
    summary: [''],
    experiences: this.fb.array([]),
    certificates: this.fb.array([])
  });

  emailInfo: InstitutionalEmailInfo = {
    isValid: false,
    careerName: 'Carrera no identificada'
  };

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  photoUploadProgress = 0;
  cvUploadProgress = 0;
  certificateUploadProgress: Record<number, number> = {};

  uploadedPhoto?: DriveFileRef;
  uploadedCv?: DriveFileRef;
  uploadedCertificates: Record<number, DriveFileRef> = {};

  constructor(
    private readonly fb: FormBuilder,
    private readonly profileService: AlumniProfileService,
    private readonly filesService: AlumniFilesService
  ) {}

  ngOnInit(): void {
    this.profileForm.get('institutionalEmail')?.valueChanges.pipe(
      startWith(this.profileForm.get('institutionalEmail')?.value || '')
    ).subscribe(email => {
      this.emailInfo = deriveCareerFromInstitutionalEmail(email || '');
    });

    this.loadProfile();
  }

  get experiencesArray(): FormArray {
    return this.profileForm.get('experiences') as FormArray;
  }

  get certificatesArray(): FormArray {
    return this.profileForm.get('certificates') as FormArray;
  }

  addExperience(initialData?: WorkExperience): void {
    this.experiencesArray.push(
      this.fb.group({
        company: [initialData?.company || '', Validators.required],
        role: [initialData?.role || '', Validators.required],
        startDate: [initialData?.startDate || '', Validators.required],
        endDate: [initialData?.endDate || ''],
        currentlyWorking: [initialData?.currentlyWorking || false],
        description: [initialData?.description || '']
      })
    );
  }

  removeExperience(index: number): void {
    this.experiencesArray.removeAt(index);
  }

  addCertificate(initialData?: Certificate): void {
    const nextIndex = this.certificatesArray.length;
    if (initialData?.file) {
      this.uploadedCertificates[nextIndex] = initialData.file;
    }

    this.certificatesArray.push(
      this.fb.group({
        title: [initialData?.title || '', Validators.required],
        institution: [initialData?.institution || '', Validators.required],
        issueDate: [initialData?.issueDate || ''],
        expiresAt: [initialData?.expiresAt || ''],
        credentialId: [initialData?.credentialId || '']
      })
    );
  }

  removeCertificate(index: number): void {
    delete this.uploadedCertificates[index];
    this.certificatesArray.removeAt(index);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.errorMessage = 'Completa los campos obligatorios antes de guardar.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    const payload = this.buildPayload();
    this.profileService.updateProfile(payload).pipe(
      finalize(() => (this.isSaving = false))
    ).subscribe({
      next: () => {
        this.successMessage = 'Perfil actualizado correctamente.';
      },
      error: () => {
        this.errorMessage = 'No fue posible guardar los cambios.';
      }
    });
  }

  onPhotoSelected(event: Event): void {
    const file = this.getSelectedFile(event);
    if (!file || !this.isAllowed(file, this.imageTypes)) {
      return;
    }

    this.photoUploadProgress = 0;
    this.filesService.uploadPhoto(file).subscribe({
      next: evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total) {
          this.photoUploadProgress = Math.round((evt.loaded / evt.total) * 100);
        }
        if (evt.type === HttpEventType.Response && evt.body) {
          this.uploadedPhoto = evt.body;
          this.successMessage = 'Foto actualizada correctamente.';
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo subir la foto.';
      }
    });
  }

  onCvSelected(event: Event): void {
    const file = this.getSelectedFile(event);
    if (!file || !this.isAllowed(file, this.cvTypes)) {
      return;
    }

    this.cvUploadProgress = 0;
    this.filesService.uploadCv(file).subscribe({
      next: evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total) {
          this.cvUploadProgress = Math.round((evt.loaded / evt.total) * 100);
        }
        if (evt.type === HttpEventType.Response && evt.body) {
          this.uploadedCv = evt.body;
          this.successMessage = 'CV actualizado correctamente.';
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo subir el CV.';
      }
    });
  }

  onCertificateSelected(event: Event, index: number): void {
    const file = this.getSelectedFile(event);
    if (!file || !this.isAllowed(file, this.certTypes)) {
      return;
    }

    this.certificateUploadProgress[index] = 0;
    this.filesService.uploadCertificate(file).subscribe({
      next: evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total) {
          this.certificateUploadProgress[index] = Math.round((evt.loaded / evt.total) * 100);
        }
        if (evt.type === HttpEventType.Response && evt.body) {
          this.uploadedCertificates[index] = evt.body;
          this.successMessage = 'Certificado actualizado correctamente.';
        }
      },
      error: () => {
        this.errorMessage = 'No se pudo subir el certificado.';
      }
    });
  }

  private loadProfile(): void {
    this.profileService.getProfile().pipe(
      finalize(() => (this.isLoading = false))
    ).subscribe({
      next: profile => this.patchProfile(profile),
      error: () => {
        this.errorMessage = 'No fue posible cargar el perfil.';
      }
    });
  }

  private patchProfile(profile: AlumniProfile): void {
    this.profileForm.patchValue({
      fullName: profile.fullName || '',
      institutionalEmail: profile.institutionalEmail || '',
      personalEmail: profile.personalEmail || '',
      phone: profile.phone || '',
      summary: profile.summary || ''
    });

    this.experiencesArray.clear();
    (profile.experiences || []).forEach(experience => this.addExperience(experience));
    if (!this.experiencesArray.length) {
      this.addExperience();
    }

    this.certificatesArray.clear();
    (profile.certificates || []).forEach(certificate => this.addCertificate(certificate));
    if (!this.certificatesArray.length) {
      this.addCertificate();
    }

    this.uploadedPhoto = profile.photo;
    this.uploadedCv = profile.cv;
  }

  private buildPayload(): AlumniProfileUpdate {
    const formValue = this.profileForm.value;

    const certificates = (formValue.certificates || []).map((certificate: Certificate, index: number) => ({
      ...certificate,
      file: this.uploadedCertificates[index]
    }));

    return {
      fullName: formValue.fullName || '',
      institutionalEmail: formValue.institutionalEmail || '',
      personalEmail: formValue.personalEmail || '',
      phone: formValue.phone || '',
      summary: formValue.summary || '',
      experiences: formValue.experiences || [],
      certificates,
      photo: this.uploadedPhoto,
      cv: this.uploadedCv
    };
  }

  private getSelectedFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files?.length ? input.files[0] : null;
  }

  private isAllowed(file: File, acceptedTypes: string[]): boolean {
    if (!acceptedTypes.includes(file.type)) {
      this.errorMessage = 'El tipo de archivo seleccionado no es permitido.';
      return false;
    }

    if (file.size > this.maxFileSizeMb * 1024 * 1024) {
      this.errorMessage = `El archivo supera el limite de ${this.maxFileSizeMb}MB.`;
      return false;
    }

    this.errorMessage = '';
    return true;
  }
}
