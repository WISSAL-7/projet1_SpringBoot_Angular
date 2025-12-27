import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,          // <-- *ngIf
    ReactiveFormsModule,   // <-- formGroup
    RouterModule           // <-- routerLink
  ],  
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  // Liste des rôles disponibles pour l'inscription (PATIENT par défaut pour le public)
  roles = ['PATIENT', 'DOCTOR']; 
  
  // Cette liste doit être récupérée d'une API si elle est dynamique
  specialties = ['Cardiologie', 'Dermatologie', 'Généraliste', 'Pédiatrie']; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire avec des validateurs
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required]],
      role: ['PATIENT', Validators.required], // Valeur par défaut
      cin: [''], // Optionnel pour les médecins
      specialty: [''] // Optionnel pour les médecins
    });
    
    // Logique pour rendre les champs spécifiques aux médecins conditionnels
    this.setupConditionalValidation();
  }
  
  private setupConditionalValidation(): void {
    const roleControl = this.registerForm.get('role');
    const cinControl = this.registerForm.get('cin');
    const specialtyControl = this.registerForm.get('specialty');

    roleControl?.valueChanges.subscribe(role => {
      if (role === 'DOCTOR') {
        // Rendre CIN et Specialty requis pour les DOCTOR
        cinControl?.setValidators(Validators.required);
        specialtyControl?.setValidators(Validators.required);
      } else {
        // Rendre CIN et Specialty non requis
        cinControl?.clearValidators();
        specialtyControl?.clearValidators();
      }
      // Mettre à jour la validation après avoir changé les validateurs
      cinControl?.updateValueAndValidity();
      specialtyControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const userData: RegisterRequest = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: () => {
          // Inscription réussie : Rediriger vers la page de connexion
          this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
        },
        error: (error) => {
          this.isLoading = false;
          // Gérer les erreurs spécifiques du backend (ex: Email déjà utilisé)
          this.errorMessage = error.error?.message || 'Échec de l\'inscription. Veuillez vérifier vos informations.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
  
  // Getter pour vérifier si le rôle sélectionné est DOCTOR
  get isDoctor(): boolean {
    return this.registerForm?.get('role')?.value === 'DOCTOR';
  }
}