// src/app/dashboard/pages/admin-panel/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: Date;
  lastLogin: Date;
}

interface SystemStat {
  label: string;
  value: number;
  icon: string;
  color: string;
  change?: number;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <!-- En-tête avec statistiques -->
      <div class="admin-header">
        <h1>🏛️ Panneau d'Administration</h1>
        <p class="subtitle">Gestion complète du système médical</p>
      </div>

      <!-- Cartes de statistiques -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of systemStats" 
             [style.border-left-color]="stat.color">
          <div class="stat-icon" [style.background]="stat.color + '20'">
            <span [style.color]="stat.color">{{ stat.icon }}</span>
          </div>
          <div class="stat-content">
            <h3>{{ stat.label }}</h3>
            <p class="stat-value">{{ stat.value | number }}</p>
            <p *ngIf="stat.change" class="stat-change" 
               [class.positive]="stat.change > 0"
               [class.negative]="stat.change < 0">
              {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <div class="tabs">
        <button *ngFor="let tab of tabs" 
                [class.active]="activeTab === tab.id"
                (click)="activeTab = tab.id">
          {{ tab.label }}
        </button>
      </div>

      <!-- Contenu des onglets -->
      <div class="tab-content">
        <!-- Onglet Utilisateurs -->
        <div *ngIf="activeTab === 'users'" class="users-section">
          <div class="section-header">
            <h3>👥 Gestion des Utilisateurs</h3>
            <button class="btn-success" (click)="addUser()">
              + Ajouter Utilisateur
            </button>
          </div>
          
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.id }}</td>
                <td>{{ user.firstName }} {{ user.lastName }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role-badge" [class]="user.role.toLowerCase()">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class]="user.status.toLowerCase()">
                    {{ user.status === 'ACTIVE' ? 'Actif' : 
                       user.status === 'INACTIVE' ? 'Inactif' : 'En attente' }}
                  </span>
                </td>
                <td>{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
                <td>{{ user.lastLogin | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="admin-actions">
                  <button class="btn-edit" (click)="editUser(user)">✏️</button>
                  <button class="btn-danger" (click)="deleteUser(user.id)">🗑️</button>
                  <button class="btn-reset" (click)="resetPassword(user.id)">🔐</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Onglet Système -->
        <div *ngIf="activeTab === 'system'" class="system-section">
          <h3>⚙️ Paramètres Système</h3>
          
          <div class="settings-grid">
            <div class="setting-card">
              <h4>Configuration Générale</h4>
              <div class="setting-item">
                <label>Nom de la clinique:</label>
                <input type="text" [(ngModel)]="clinicName" class="setting-input">
              </div>
              <div class="setting-item">
                <label>Email de contact:</label>
                <input type="email" [(ngModel)]="clinicEmail" class="setting-input">
              </div>
              <div class="setting-item">
                <label>Téléphone:</label>
                <input type="tel" [(ngModel)]="clinicPhone" class="setting-input">
              </div>
            </div>

            <div class="setting-card">
              <h4>Paramètres RDV</h4>
              <div class="setting-item">
                <label>Durée par défaut (minutes):</label>
                <input type="number" [(ngModel)]="appointmentDuration" class="setting-input">
              </div>
              <div class="setting-item">
                <label>Heure d'ouverture:</label>
                <input type="time" [(ngModel)]="openingTime" class="setting-input">
              </div>
              <div class="setting-item">
                <label>Heure de fermeture:</label>
                <input type="time" [(ngModel)]="closingTime" class="setting-input">
              </div>
            </div>

            <div class="setting-card">
              <h4>Sécurité</h4>
              <div class="setting-item">
                <label>Session timeout (minutes):</label>
                <input type="number" [(ngModel)]="sessionTimeout" class="setting-input">
              </div>
              <div class="setting-item">
                <label>Nombre max tentatives connexion:</label>
                <input type="number" [(ngModel)]="maxLoginAttempts" class="setting-input">
              </div>
              <button class="btn-save" (click)="saveSystemSettings()">
                💾 Sauvegarder
              </button>
            </div>
          </div>
        </div>

        <!-- Onglet Logs -->
        <div *ngIf="activeTab === 'logs'" class="logs-section">
          <h3>📊 Journal d'activité</h3>
          <div class="logs-list">
            <div *ngFor="let log of systemLogs" class="log-entry">
              <span class="log-time">{{ log.timestamp | date:'HH:mm:ss' }}</span>
              <span class="log-level" [class]="log.level">{{ log.level }}</span>
              <span class="log-message">{{ log.message }}</span>
              <span class="log-user">{{ log.user }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }
    .admin-header {
      margin-bottom: 30px;
    }
    .admin-header h1 {
      margin: 0;
      color: #2c3e50;
    }
    .subtitle {
      color: #7f8c8d;
      margin: 5px 0 0 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      border-left: 4px solid #3498db;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .stat-content h3 {
      margin: 0 0 5px 0;
      color: #7f8c8d;
      font-size: 0.9em;
    }
    .stat-value {
      margin: 0;
      font-size: 1.8em;
      font-weight: bold;
      color: #2c3e50;
    }
    .stat-change {
      margin: 5px 0 0 0;
      font-size: 0.85em;
    }
    .stat-change.positive {
      color: #27ae60;
    }
    .stat-change.negative {
      color: #e74c3c;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 10px;
    }
    .tabs button {
      padding: 10px 20px;
      background: none;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    }
    .tabs button.active {
      background: #3498db;
      color: white;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .btn-success {
      background: #27ae60;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
    .admin-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .admin-table th {
      background: #34495e;
      color: white;
      padding: 15px;
      text-align: left;
    }
    .admin-table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    .role-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .role-badge.admin {
      background: #8e44ad;
      color: white;
    }
    .role-badge.doctor {
      background: #3498db;
      color: white;
    }
    .role-badge.patient {
      background: #2ecc71;
      color: white;
    }
    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .status-badge.active {
      background: #d5f4e6;
      color: #27ae60;
    }
    .status-badge.inactive {
      background: #fadbd8;
      color: #e74c3c;
    }
    .status-badge.pending {
      background: #fef9e7;
      color: #f39c12;
    }
    .admin-actions {
      display: flex;
      gap: 8px;
    }
    .admin-actions button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-edit {
      background: #f39c12;
      color: white;
    }
    .btn-danger {
      background: #e74c3c;
      color: white;
    }
    .btn-reset {
      background: #95a5a6;
      color: white;
    }
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .setting-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .setting-card h4 {
      margin-top: 0;
      color: #2c3e50;
    }
    .setting-item {
      margin-bottom: 15px;
    }
    .setting-item label {
      display: block;
      margin-bottom: 5px;
      color: #7f8c8d;
      font-size: 0.9em;
    }
    .setting-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .btn-save {
      background: #27ae60;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 15px;
    }
    .logs-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-height: 400px;
      overflow-y: auto;
    }
    .log-entry {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .log-entry:last-child {
      border-bottom: none;
    }
    .log-time {
      color: #7f8c8d;
      font-size: 0.9em;
      min-width: 80px;
    }
    .log-level {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      min-width: 60px;
      text-align: center;
    }
    .log-level.info {
      background: #d1ecf1;
      color: #0c5460;
    }
    .log-level.warn {
      background: #fff3cd;
      color: #856404;
    }
    .log-level.error {
      background: #f8d7da;
      color: #721c24;
    }
    .log-message {
      flex: 1;
    }
    .log-user {
      color: #3498db;
      font-weight: 500;
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  activeTab = 'users';
  clinicName = 'Clinique Médicale';
  clinicEmail = 'contact@clinique.com';
  clinicPhone = '0522-123456';
  appointmentDuration = 30;
  openingTime = '08:00';
  closingTime = '18:00';
  sessionTimeout = 30;
  maxLoginAttempts = 3;

  tabs = [
    { id: 'users', label: '👥 Utilisateurs' },
    { id: 'system', label: '⚙️ Système' },
    { id: 'logs', label: '📊 Logs' }
  ];

  systemStats: SystemStat[] = [
    { label: 'Utilisateurs Actifs', value: 154, icon: '👥', color: '#3498db', change: 12 },
    { label: 'RDV Aujourd\'hui', value: 23, icon: '📅', color: '#2ecc71', change: 5 },
    { label: 'Médecins', value: 15, icon: '👨‍⚕️', color: '#9b59b6', change: 2 },
    { label: 'Patients', value: 423, icon: '👤', color: '#e74c3c', change: 8 },
    { label: 'Revenus (K DH)', value: 125, icon: '💰', color: '#f39c12', change: 15 },
    { label: 'Salles', value: 8, icon: '🏥', color: '#1abc9c', change: 0 }
  ];

  users: User[] = [
    { id: 1, email: 'admin@clinique.com', firstName: 'Admin', lastName: 'System', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date('2023-01-01'), lastLogin: new Date() },
    { id: 2, email: 'dr.smith@clinique.com', firstName: 'John', lastName: 'Smith', role: 'DOCTOR', status: 'ACTIVE', createdAt: new Date('2023-02-15'), lastLogin: new Date('2024-01-14') },
    { id: 3, email: 'patient.doe@email.com', firstName: 'Jane', lastName: 'Doe', role: 'PATIENT', status: 'ACTIVE', createdAt: new Date('2023-03-10'), lastLogin: new Date('2024-01-13') }
  ];

  systemLogs = [
    { timestamp: new Date(), level: 'INFO', message: 'Système démarré', user: 'System' },
    { timestamp: new Date(Date.now() - 300000), level: 'WARN', message: 'Tentative de connexion échouée', user: 'john.smith' },
    { timestamp: new Date(Date.now() - 600000), level: 'INFO', message: 'Nouveau rendez-vous créé', user: 'dr.jones' }
  ];

  ngOnInit() {
    // Charger les données depuis l'API
    this.loadAdminData();
  }

  loadAdminData() {
    // À implémenter avec des appels API
  }

  addUser() {
    alert('Fonctionnalité: Ajouter un utilisateur');
  }

  editUser(user: User) {
    alert(`Modifier l'utilisateur: ${user.firstName} ${user.lastName}`);
  }

  deleteUser(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.users = this.users.filter(u => u.id !== id);
    }
  }

  resetPassword(id: number) {
    alert(`Réinitialiser le mot de passe pour l'utilisateur ID: ${id}`);
  }

  saveSystemSettings() {
    alert('Paramètres système sauvegardés!');
    // À implémenter avec appel API
  }
}