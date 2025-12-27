import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="test-page">
      <h2>🔧 Page de Test - Rendez-vous Médicaux</h2>
      
      <div class="test-section">
        <h3>1. Connexion Rapide (Mock)</h3>
        <div class="button-group">
          <button (click)="loginAs('PATIENT')" class="btn-patient">
            👤 Se connecter en tant que Patient
          </button>
          <button (click)="loginAs('DOCTOR')" class="btn-doctor">
            👨‍⚕️ Se connecter en tant que Docteur
          </button>
          <button (click)="loginAs('ADMIN')" class="btn-admin">
            👑 Se connecter en tant qu'Admin
          </button>
          <button (click)="logout()" class="btn-logout">
            🚪 Déconnexion
          </button>
        </div>
      </div>

      <div class="test-section">
        <h3>2. Navigation vers les pages</h3>
        <div class="button-group">
          <a routerLink="/auth/login" class="btn-link">🔐 Page Login</a>
          <a routerLink="/auth/register" class="btn-link">📝 Page Register</a>
          <a routerLink="/dashboard" class="btn-link">🏠 Dashboard</a>
          <a routerLink="/dashboard/patients" class="btn-link">👥 Patients (Docteur/Admin)</a>
          <a routerLink="/dashboard/admin" class="btn-link">⚙️ Admin Panel</a>
        </div>
      </div>

      <div class="test-section">
        <h3>3. État actuel</h3>
        <div class="status-box">
          <p><strong>Connecté :</strong> {{ isLoggedIn ? '✅ Oui' : '❌ Non' }}</p>
          <p><strong>Rôle :</strong> {{ userRole || 'Aucun' }}</p>
          <p><strong>Token :</strong> {{ authToken ? 'Présent' : 'Absent' }}</p>
        </div>
      </div>

      <div class="test-section">
        <h3>4. Tester les Guards</h3>
        <p>Essayez d'accéder à ces pages sans être connecté :</p>
        <ul>
          <li><a routerLink="/dashboard">/dashboard</a> - Doit rediriger vers login</li>
          <li><a routerLink="/dashboard/patients">/dashboard/patients</a> - Doit rediriger si pas docteur/admin</li>
          <li><a routerLink="/dashboard/admin">/dashboard/admin</a> - Doit rediriger si pas admin</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .test-page {
      padding: 30px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .test-section {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 15px 0;
    }
    button, .btn-link {
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }
    .btn-patient {
      background: #2ecc71;
      color: white;
    }
    .btn-doctor {
      background: #3498db;
      color: white;
    }
    .btn-admin {
      background: #9b59b6;
      color: white;
    }
    .btn-logout {
      background: #e74c3c;
      color: white;
    }
    .btn-link {
      background: #95a5a6;
      color: white;
      min-width: 200px;
    }
    .status-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #3498db;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin: 10px 0;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class TestPageComponent {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.getToken() !== null;
  }

  get userRole(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? user.role : null;
  }

  get authToken(): string | null {
    return this.authService.getToken();
  }

  loginAs(role: 'PATIENT' | 'DOCTOR' | 'ADMIN') {
    this.authService.quickLogin(role);
  }

  logout() {
    this.authService.quickLogout();
  }
}