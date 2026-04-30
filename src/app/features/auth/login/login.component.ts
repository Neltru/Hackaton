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
      matricula: ['', [Validators.required]],
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

      const loginPayload = {
        nombre_usuario: this.loginForm.get('matricula')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginPayload).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // El backend indica si se requiere 2FA con la propiedad require_2fa
          if (response.require_2fa) {
            this.show2FA = true;
            this.pendingEmail = this.loginForm.get('matricula')?.value;
          } else if (response.token) {
            const finalRole = response.user?.rol_id;
            this.handleNavigation(finalRole);
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
        nombre_usuario: this.pendingEmail,
        codigo: this.twoFactorForm.get('code')?.value
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          const finalRole = response.user?.rol_id;
          this.handleNavigation(finalRole);
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
    // Obtenemos el rol de la respuesta o del almacenamiento local
    const rawRole = role || this.authService.getRole();
    const userRole = rawRole?.toString().toLowerCase() || '';
    
    console.log('Navegando para el rol:', userRole);

    // Mapeo: 1 -> Alumni, 2 -> Company, 3 -> Admin
    if (userRole === 'admin' || userRole === 'administrador_ut' || userRole === '3') {
      this.router.navigate(['/administracion/dashboard']);
    } else if (userRole === 'company' || userRole === 'empresa' || userRole === '2') {
      this.router.navigate(['/company/dashboard']);
    } else if (userRole === 'alumni' || userRole === 'egresado' || userRole === '1') {
      this.router.navigate(['/alumni/dashboard']);
    } else {
      // Por defecto, si no hay rol claro, mandamos a login o a una página neutra
      console.warn('Rol no reconocido:', userRole);
      this.router.navigate(['/alumni/dashboard']);
    }
  }

  cancel2FA() {
    this.show2FA = false;
    this.pendingEmail = null;
    this.twoFactorForm.reset();
  }
}
