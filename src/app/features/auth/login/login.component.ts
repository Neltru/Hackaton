import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  
  isLoading = false;
  errorMessage: string | null = null;
  
  // Control de flujo 2FA
  show2FA = false;
  pendingEmail: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // Asumimos que si no hay token pero el login fue exitoso, es porque requiere 2FA
          // O si el backend envía un flag específico (ej. response.requires2fa)
          if (!response.token) {
            this.show2FA = true;
            this.pendingEmail = response.user?.email || this.loginForm.get('email')?.value;
          } else {
            this.handleNavigation(response.role);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Credenciales inválidas o error de conexión.';
          console.error('Login error', err);
        }
      });
    }
  }

  onVerify2FA() {
    if (this.twoFactorForm.valid && this.pendingEmail) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.verify2fa({
        email: this.pendingEmail,
        code: this.twoFactorForm.get('code')?.value
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.handleNavigation(response.role);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Código inválido o expirado.';
          console.error('2FA error', err);
        }
      });
    }
  }

  private handleNavigation(role: string | number | undefined) {
    const userRole = role?.toString().toLowerCase() || String(this.authService.getRole()).toLowerCase();
    
    if (userRole === 'admin' || userRole === 'administrador_ut' || userRole === '3') {
      this.router.navigate(['/administracion/dashboard']);
    } else if (userRole === 'company' || userRole === 'empresa' || userRole === '2') {
      this.router.navigate(['/company/dashboard']);
    } else {
      this.router.navigate(['/alumni/dashboard']);
    }
  }

  cancel2FA() {
    this.show2FA = false;
    this.pendingEmail = null;
    this.twoFactorForm.reset();
  }
}
