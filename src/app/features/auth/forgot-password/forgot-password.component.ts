import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  isSent = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      this.authService.recoverPassword({ nombre_usuario: this.forgotForm.get('email')?.value }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isSent = true;
          console.log('Recovery response', response);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'No pudimos procesar tu solicitud. Verifica tu conexión.';
          console.error('Recovery error', err);
        }
      });
    }
  }
}
