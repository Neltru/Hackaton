import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumniProfile, AlumniProfileUpdate } from '../../../core/models/alumni-profile.models';
import { AlumniProfileService } from '../../../core/services/alumni-profile.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  // Datos del Perfil
  profile?: AlumniProfile;
  
  // Formulario Editable
  editForm: FormGroup;
  
  isLoading = true;
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private profileService: AlumniProfileService
  ) {
    this.editForm = this.fb.group({
      correo_alternativo: ['', [Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]{10}$')]],
      linkedin_url: ['', [Validators.pattern('^(https?://)?(www\\.)?linkedin\\.com/.*$')]],
      cv_drive_url: ['', [Validators.required]],
      disponibilidad: ['activo', [Validators.required]],
      resumen_profesional: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.profileService.getProfile().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.profile = data;
        this.patchForm(data);
      },
      error: () => {
        this.errorMessage = 'Error al cargar los datos del perfil.';
      }
    });
  }

  patchForm(data: AlumniProfile) {
    this.editForm.patchValue({
      correo_alternativo: data.correo_alternativo,
      telefono: data.telefono,
      linkedin_url: data.linkedin_url,
      cv_drive_url: data.cv_drive_url,
      disponibilidad: data.disponibilidad,
      resumen_profesional: data.resumen_profesional
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.isSaving = true;
      this.successMessage = '';
      this.errorMessage = '';

      const updateData: AlumniProfileUpdate = this.editForm.value;
      
      this.profileService.updateProfile(updateData as any).pipe(
        finalize(() => this.isSaving = false)
      ).subscribe({
        next: () => {
          this.successMessage = '¡Perfil actualizado con éxito!';
          // Actualizar datos locales
          if (this.profile) {
            this.profile = { ...this.profile, ...updateData };
          }
        },
        error: () => {
          this.errorMessage = 'Hubo un error al guardar los cambios.';
        }
      });
    }
  }
}
