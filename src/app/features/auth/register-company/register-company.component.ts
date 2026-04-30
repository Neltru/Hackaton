import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.scss'
})
export class RegisterCompanyComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      estado: ['', [Validators.required]],
      municipio: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.authService.registerEmpresa(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registro exitoso. Ahora puedes iniciar sesión.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Ocurrió un error durante el registro. Intenta de nuevo.';
          console.error('Registration error', err);
        }
      });
    }
  }
}
