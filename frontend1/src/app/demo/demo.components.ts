// src/app/demo/demo.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Bannière d'en-tête -->
    <header class="demo-header">
      <div class="header-content">
        <h1>🏥 Système de Gestion des Rendez-vous Médicaux</h1>
        <p class="subtitle">Interface Angular - Spring Boot - Démonstration complète</p>
        <div class="demo-badges">
          <span class="badge angular">Angular 17+</span>
          <span class="badge spring">Spring Boot 3</span>
          <span class="badge typescript">TypeScript</span>
          <span class="badge jwt">JWT Auth</span>
        </div>
      </div>
    </header>

    <div class="demo-container">
      <!-- Navigation entre les pages de démo -->
      <nav class="demo-nav">
        <button (click)="currentPage = 'login'" [class.active]="currentPage === 'login'">🔐 Login</button>
        <button (click)="currentPage = 'register'" [class.active]="currentPage === 'register'">📝 Register</button>
        <button (click)="currentPage = 'dashboard'" [class.active]="currentPage === 'dashboard'">🏠 Dashboard</button>
        <button (click)="currentPage = 'patients'" [class.active]="currentPage === 'patients'">👥 Patients</button>
        <button (click)="currentPage = 'admin'" [class.active]="currentPage === 'admin'">⚙️ Admin</button>
      </nav>

      <!-- Section d'information -->
      <div class="demo-info">
        <h3>📋 Page de démonstration</h3>
        <p>Cette page montre toutes les interfaces du projet sans exécuter le code réel.</p>
        <p><strong>Page actuelle :</strong> {{getPageTitle()}}</p>
        
        <div class="user-status">
          <span>Utilisateur : {{currentUser.role}} - {{currentUser.firstName}} {{currentUser.lastName}}</span>
          <button class="btn-switch" (click)="switchUser()">
            🔄 Changer d'utilisateur
          </button>
        </div>
      </div>

      <!-- Contenu selon la page sélectionnée -->
      <div class="demo-content">
        
        <!-- Page Login -->
        <div *ngIf="currentPage === 'login'" class="page login-page">
          <div class="page-header">
            <h2>🔐 Connexion au Système</h2>
            <p>Authentification sécurisée avec JWT Token</p>
          </div>
          
          <div class="form-demo">
            <div class="input-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="loginData.email" placeholder="user@example.com">
            </div>
            
            <div class="input-group">
              <label>Mot de passe</label>
              <input type="password" [(ngModel)]="loginData.password" value="••••••••">
            </div>
            
            <div class="form-actions">
              <button class="btn-login">Se connecter</button>
              <button class="btn-link" (click)="currentPage = 'register'">Créer un compte</button>
            </div>
            
            <div class="demo-note">
              <strong>Fonctionnalités :</strong>
              <ul>
                <li>Validation en temps réel des champs</li>
                <li>Authentification JWT avec Spring Security</li>
                <li>Redirection selon le rôle (Patient/Docteur/Admin)</li>
                <li>Gestion des tokens et refresh tokens</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Page Register -->
        <div *ngIf="currentPage === 'register'" class="page register-page">
          <div class="page-header">
            <h2>📝 Inscription Nouvel Utilisateur</h2>
            <p>Création de compte patient ou médecin</p>
          </div>
          
          <div class="form-demo">
            <div class="form-row">
              <div class="input-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="registerData.firstName" placeholder="Jean">
              </div>
              
              <div class="input-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="registerData.lastName" placeholder="Dupont">
              </div>
            </div>
            
            <div class="input-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="registerData.email" placeholder="jean.dupont@email.com">
            </div>
            
            <div class="input-group">
              <label>Mot de passe</label>
              <input type="password" [(ngModel)]="registerData.password" value="password123">
            </div>
            
            <div class="input-group">
              <label>Téléphone</label>
              <input type="tel" [(ngModel)]="registerData.phone" placeholder="0612345678">
            </div>
            
            <div class="input-group">
              <label>Je suis...</label>
              <select [(ngModel)]="registerData.role" (change)="onRoleChange()">
                <option value="PATIENT">👤 Patient</option>
                <option value="DOCTOR">👨‍⚕️ Médecin</option>
              </select>
            </div>
            
            <!-- Champs médecin -->
            <div *ngIf="registerData.role === 'DOCTOR'" class="doctor-fields">
              <div class="input-group">
                <label>CIN</label>
                <input type="text" [(ngModel)]="registerData.cin" placeholder="AB123456">
              </div>
              
              <div class="input-group">
                <label>Spécialité</label>
                <select [(ngModel)]="registerData.specialty">
                  <option>Cardiologie</option>
                  <option>Dermatologie</option>
                  <option>Généraliste</option>
                  <option>Pédiatrie</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button class="btn-register">S'inscrire</button>
              <button class="btn-link" (click)="currentPage = 'login'">Déjà un compte ?</button>
            </div>
            
            <div class="demo-note">
              <strong>Processus d'inscription :</strong>
              <ol>
                <li>Validation des données côté Angular</li>
                <li>Envoi à l'API Spring Boot POST /api/auth/register</li>
                <li>Création de l'utilisateur dans la base de données</li>
                <li>Génération automatique du token JWT</li>
                <li>Redirection vers le dashboard approprié</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Page Dashboard -->
        <div *ngIf="currentPage === 'dashboard'" class="page dashboard-page">
          <div class="dashboard-layout">
            <!-- Sidebar -->
            <aside class="sidebar">
              <div class="sidebar-header">
                <h3>🏥 Clinique Médicale</h3>
                <p class="user-info">{{currentUser.firstName}} {{currentUser.lastName}}</p>
                <p class="user-role">{{currentUser.role === 'DOCTOR' ? 'Médecin' : 'Patient'}}</p>
              </div>
              
              <nav class="sidebar-nav">
                <a [class.active]="true">📊 Tableau de bord</a>
                <a>📅 Mes rendez-vous</a>
                <a>👤 Mon profil</a>
                <a *ngIf="currentUser.role === 'DOCTOR'">👥 Mes patients</a>
                <a *ngIf="currentUser.role === 'ADMIN'">⚙️ Administration</a>
                <a class="logout">🚪 Déconnexion</a>
              </nav>
            </aside>
            
            <!-- Contenu principal -->
            <main class="dashboard-content">
              <div class="content-header">
                <h2>Bienvenue, {{currentUser.firstName}} !</h2>
                <p>Votre tableau de bord personnel</p>
              </div>
              
              <!-- Cartes de statistiques -->
              <div class="stats-cards">
                <div class="stat-card" *ngFor="let stat of dashboardStats">
                  <div class="stat-icon" [style.background]="stat.color">
                    {{stat.icon}}
                  </div>
                  <div class="stat-info">
                    <h4>{{stat.label}}</h4>
                    <p class="stat-value">{{stat.value}}</p>
                  </div>
                </div>
              </div>
              
              <!-- Tableau des prochains RDV -->
              <div class="appointments-section">
                <h3>📅 Prochains rendez-vous</h3>
                <table class="appointments-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Heure</th>
                      <th *ngIf="currentUser.role === 'DOCTOR'">Patient</th>
                      <th *ngIf="currentUser.role === 'PATIENT'">Médecin</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let appointment of demoAppointments">
                      <td>{{appointment.date}}</td>
                      <td>{{appointment.time}}</td>
                      <td>{{appointment.patient || appointment.doctor}}</td>
                      <td>
                        <span class="status-badge" [class]="appointment.status">
                          {{appointment.status}}
                        </span>
                      </td>
                      <td>
                        <button class="btn-action">👁️</button>
                        <button class="btn-action">✏️</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>

        <!-- Page Patients -->
        <div *ngIf="currentPage === 'patients'" class="page patients-page">
          <div class="page-header">
            <h2>👥 Gestion des Patients</h2>
            <p>Interface médecin/administrateur</p>
          </div>
          
          <div class="patients-container">
            <!-- Barre de recherche et actions -->
            <div class="patients-toolbar">
              <input type="text" placeholder="Rechercher un patient..." class="search-input">
              <button class="btn-add">➕ Nouveau patient</button>
              <button class="btn-export">📤 Exporter</button>
            </div>
            
            <!-- Tableau des patients -->
            <table class="patients-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Dernier RDV</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let patient of demoPatients">
                  <td>{{patient.id}}</td>
                  <td>
                    <div class="patient-info">
                      <strong>{{patient.name}}</strong>
                      <small>CIN: {{patient.cin}}</small>
                    </div>
                  </td>
                  <td>{{patient.email}}</td>
                  <td>{{patient.phone}}</td>
                  <td>{{patient.lastAppointment}}</td>
                  <td>
                    <span class="patient-status" [class]="patient.status">
                      {{patient.status}}
                    </span>
                  </td>
                  <td>
                    <button class="btn-action">👁️</button>
                    <button class="btn-action">✏️</button>
                    <button class="btn-action danger">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Pagination -->
            <div class="pagination">
              <button class="btn-pag prev">◀ Précédent</button>
              <span class="page-info">Page 1 sur 5</span>
              <button class="btn-pag next">Suivant ▶</button>
            </div>
          </div>
        </div>

        <!-- Page Admin -->
        <div *ngIf="currentPage === 'admin'" class="page admin-page">
          <div class="page-header">
            <h2>⚙️ Panneau d'Administration</h2>
            <p>Gestion complète du système</p>
          </div>
          
          <div class="admin-container">
            <!-- Onglets admin -->
            <div class="admin-tabs">
              <button [class.active]="adminTab === 'users'">👥 Utilisateurs</button>
              <button [class.active]="adminTab === 'system'">⚙️ Système</button>
              <button [class.active]="adminTab === 'logs'">📊 Logs</button>
            </div>
            
            <!-- Contenu onglets -->
            <div *ngIf="adminTab === 'users'" class="tab-content">
              <h3>Gestion des Utilisateurs</h3>
              <div class="admin-stats">
                <div class="admin-stat">
                  <span class="stat-number">154</span>
                  <span class="stat-label">Utilisateurs totaux</span>
                </div>
                <div class="admin-stat">
                  <span class="stat-number">23</span>
                  <span class="stat-label">Médecins</span>
                </div>
                <div class="admin-stat">
                  <span class="stat-number">5</span>
                  <span class="stat-label">Admins</span>
                </div>
              </div>
            </div>
            
            <div *ngIf="adminTab === 'system'" class="tab-content">
              <h3>Paramètres Système</h3>
              <div class="system-settings">
                <div class="setting">
                  <label>Nom de la clinique</label>
                  <input type="text" value="Clinique Médicale Principale">
                </div>
                <div class="setting">
                  <label>Heures d'ouverture</label>
                  <input type="time" value="08:00"> à <input type="time" value="18:00">
                </div>
                <div class="setting">
                  <label>Durée RDV par défaut</label>
                  <select>
                    <option>15 minutes</option>
                    <option selected>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div *ngIf="adminTab === 'logs'" class="tab-content">
              <h3>Journal d'Activité</h3>
              <div class="logs-container">
                <div class="log-entry" *ngFor="let log of systemLogs">
                  <span class="log-time">{{log.time}}</span>
                  <span class="log-level" [class]="log.level">{{log.level}}</span>
                  <span class="log-message">{{log.message}}</span>
                  <span class="log-user">{{log.user}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer avec les infos techniques -->
      <footer class="demo-footer">
        <div class="tech-stack">
          <h4>🛠️ Stack Technologique</h4>
          <div class="tech-list">
            <div class="tech-item">
              <strong>Frontend:</strong> Angular 17, TypeScript, RxJS, Angular Material
            </div>
            <div class="tech-item">
              <strong>Backend:</strong> Spring Boot 3, Spring Security, JPA, MySQL
            </div>
            <div class="tech-item">
              <strong>Authentification:</strong> JWT Tokens, Role-based Access Control
            </div>
            <div class="tech-item">
              <strong>API:</strong> RESTful, Swagger Documentation, CORS Configuration
            </div>
          </div>
        </div>
        
        <div class="project-structure">
          <h4>📁 Structure du Projet</h4>
          <pre class="structure-code">
src/
├── app/
│   ├── core/                    # Services, interceptors, guards
│   ├── shared/                  # Components réutilisables
│   ├── auth/                    # Authentification
│   ├── features/                # Modules fonctionnels
│   │   ├── appointments/       # Gestion RDV
│   │   ├── doctors/            # Gestion médecins
│   │   ├── patients/           # Gestion patients
│   │   └── dashboard/          # Tableaux de bord
│   └── models/                 # Interfaces TypeScript
├── assets/                     # Images, styles
└── environments/               # Configurations
          </pre>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* Styles généraux */
    .demo-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f7fa;
      min-height: 100vh;
    }

    /* Header */
    .demo-header {
      background: linear-gradient(135deg, #3f51b5 0%, #2196f3 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(63, 81, 181, 0.3);
    }

    .header-content h1 {
      margin: 0;
      font-size: 32px;
    }

    .subtitle {
      opacity: 0.9;
      margin: 10px 0 20px;
    }

    .demo-badges {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }

    .badge.angular {
      background: #dd0031;
      color: white;
    }

    .badge.spring {
      background: #6db33f;
      color: white;
    }

    .badge.typescript {
      background: #3178c6;
      color: white;
    }

    .badge.jwt {
      background: #000000;
      color: white;
    }

    /* Navigation */
    .demo-nav {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      background: white;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .demo-nav button {
      padding: 12px 24px;
      border: none;
      background: #f5f5f5;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
    }

    .demo-nav button:hover {
      background: #e0e0e0;
      transform: translateY(-2px);
    }

    .demo-nav button.active {
      background: #3f51b5;
      color: white;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);
    }

    /* Information section */
    .demo-info {
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .user-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .btn-switch {
      background: #ff9800;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }

    /* Pages */
    .page {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    .page-header {
      background: linear-gradient(135deg, #673ab7 0%, #9575cd 100%);
      color: white;
      padding: 25px 30px;
    }

    .page-header h2 {
      margin: 0;
      font-size: 28px;
    }

    .page-header p {
      margin: 5px 0 0;
      opacity: 0.9;
    }

    /* Formulaires */
    .form-demo {
      padding: 30px;
    }

    .input-group {
      margin-bottom: 20px;
    }

    .input-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #424242;
    }

    .input-group input, .input-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.3s;
      box-sizing: border-box;
    }

    .input-group input:focus, .input-group select:focus {
      outline: none;
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .doctor-fields {
      background: #f0f7ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #2196f3;
    }

    /* Boutons */
    .form-actions {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-top: 30px;
    }

    .btn-login, .btn-register {
      background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      min-width: 150px;
    }

    .btn-link {
      background: none;
      border: none;
      color: #3f51b5;
      cursor: pointer;
      font-size: 14px;
    }

    /* Dashboard */
    .dashboard-layout {
      display: flex;
      min-height: 600px;
    }

    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      padding: 20px;
    }

    .sidebar-header {
      margin-bottom: 30px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sidebar-nav a {
      color: #bdc3c7;
      text-decoration: none;
      padding: 12px;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .sidebar-nav a:hover, .sidebar-nav a.active {
      background: #34495e;
      color: white;
    }

    .dashboard-content {
      flex: 1;
      padding: 30px;
      background: #f5f7fa;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin: 5px 0 0;
    }

    /* Tableaux */
    .appointments-table, .patients-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-top: 20px;
    }

    table th {
      background: #37474f;
      color: white;
      padding: 15px;
      text-align: left;
    }

    table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    .status-badge, .patient-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .status-badge.confirmed, .patient-status.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.pending, .patient-status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .btn-action {
      background: none;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 6px 10px;
      margin: 0 3px;
      cursor: pointer;
    }

    .btn-action.danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    /* Admin */
    .admin-tabs {
      display: flex;
      gap: 10px;
      margin: 20px 0;
    }

    .admin-tabs button {
      padding: 10px 20px;
      border: none;
      background: #f5f5f5;
      border-radius: 6px;
      cursor: pointer;
    }

    .admin-tabs button.active {
      background: #3f51b5;
      color: white;
    }

    /* Notes de démo */
    .demo-note {
      background: #e8f5e9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
      border-left: 4px solid #4caf50;
    }

    .demo-note ul, .demo-note ol {
      margin: 10px 0 0 20px;
    }

    /* Footer */
    .demo-footer {
      background: white;
      padding: 30px;
      border-radius: 12px;
      margin-top: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .tech-stack, .project-structure {
      margin-bottom: 30px;
    }

    .tech-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }

    .tech-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
    }

    .structure-code {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-row, .stats-cards, .tech-list {
        grid-template-columns: 1fr;
      }
      
      .dashboard-layout {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
      }
      
      .demo-nav {
        overflow-x: auto;
      }
      
      .demo-nav button {
        flex-shrink: 0;
      }
    }

    /* Animations */
    .page {
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class DemoComponent {
  currentPage: 'login' | 'register' | 'dashboard' | 'patients' | 'admin' = 'login';
  adminTab: 'users' | 'system' | 'logs' = 'users';
  
  currentUser = {
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'PATIENT' as 'PATIENT' | 'DOCTOR' | 'ADMIN',
    email: 'jean.dupont@email.com'
  };
  
  loginData = {
    email: 'user@example.com',
    password: 'password123'
  };
  
  registerData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    password: 'password123',
    phone: '0612345678',
    role: 'PATIENT' as 'PATIENT' | 'DOCTOR',
    cin: '',
    specialty: ''
  };
  
  dashboardStats = [
    { icon: '📅', label: 'RDV Aujourd\'hui', value: '3', color: '#3f51b5' },
    { icon: '👥', label: 'Patients Totaux', value: '42', color: '#4caf50' },
    { icon: '⏰', label: 'RDV En Attente', value: '7', color: '#ff9800' },
    { icon: '✅', label: 'RDV Terminés', value: '156', color: '#9c27b0' }
  ];
  
  demoAppointments = [
    { date: '15/01/2024', time: '09:00', patient: 'Marie Martin', doctor: 'Dr. Smith', status: 'confirmé' },
    { date: '15/01/2024', time: '10:30', patient: 'Pierre Dubois', doctor: 'Dr. Johnson', status: 'en attente' },
    { date: '15/01/2024', time: '14:00', patient: 'Sophie Bernard', doctor: 'Dr. Williams', status: 'confirmé' }
  ];
  
  demoPatients = [
    { id: 1, name: 'Marie Martin', email: 'marie.martin@email.com', phone: '0623456789', cin: 'AB123456', lastAppointment: '10/01/2024', status: 'actif' },
    { id: 2, name: 'Pierre Dubois', email: 'pierre.dubois@email.com', phone: '0634567890', cin: 'CD789012', lastAppointment: '08/01/2024', status: 'actif' },
    { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', phone: '0645678901', cin: 'EF345678', lastAppointment: '05/01/2024', status: 'inactif' }
  ];
  
  systemLogs = [
    { time: '09:15:23', level: 'INFO', message: 'Utilisateur connecté', user: 'admin' },
    { time: '09:12:45', level: 'WARN', message: 'Tentative de connexion échouée', user: 'user123' },
    { time: '09:05:12', level: 'INFO', message: 'Nouveau rendez-vous créé', user: 'dr.smith' },
    { time: '08:45:33', level: 'ERROR', message: 'Erreur base de données', user: 'system' }
  ];
  
  getPageTitle(): string {
    const titles = {
      'login': 'Page de Connexion',
      'register': 'Page d\'Inscription',
      'dashboard': 'Tableau de Bord',
      'patients': 'Gestion des Patients',
      'admin': 'Panneau d\'Administration'
    };
    return titles[this.currentPage];
  }
  
  switchUser(): void {
    const users = [
      { firstName: 'Jean', lastName: 'Dupont', role: 'PATIENT' as const },
      { firstName: 'Dr. Marie', lastName: 'Martin', role: 'DOCTOR' as const },
      { firstName: 'Admin', lastName: 'System', role: 'ADMIN' as const }
    ];
    
    const currentIndex = users.findIndex(u => u.role === this.currentUser.role);
    const nextIndex = (currentIndex + 1) % users.length;
    this.currentUser = { ...this.currentUser, ...users[nextIndex] };
  }
  
  onRoleChange(): void {
    // Simuler le changement de rôle dans le formulaire d'inscription
    if (this.registerData.role === 'DOCTOR') {
      this.registerData.cin = 'AB123456';
      this.registerData.specialty = 'Cardiologie';
    } else {
      this.registerData.cin = '';
      this.registerData.specialty = '';
    }
  }
}