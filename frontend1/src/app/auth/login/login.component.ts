import { Component } from '@angular/core';
import { AuthService , LoginRequest} from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
imports: [
    CommonModule,          // <-- *ngIf
    ReactiveFormsModule,   // <-- formGroup
    RouterModule           // <-- routerLink
  ],  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials: LoginRequest = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Redirection selon le rôle
          switch(response.role) {
            case 'ADMIN':
              this.router.navigate(['/admin/dashboard']);
              break;
            case 'DOCTOR':
              this.router.navigate(['/doctor/dashboard']);
              break;
            case 'PATIENT':
              this.router.navigate(['/patient/dashboard']);
              break;
            default:
              this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Échec de la connexion';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}