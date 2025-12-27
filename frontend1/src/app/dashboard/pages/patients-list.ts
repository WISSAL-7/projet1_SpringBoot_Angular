// src/app/dashboard/pages/patients-list/patients-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cin: string;
  birthDate: Date;
  gender: 'M' | 'F';
  appointmentsCount: number;
  lastAppointment: Date;
}

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="patients-container">
      <div class="header">
        <h2>Gestion des Patients</h2>
        <div class="actions">
          <input type="text" 
                 [(ngModel)]="searchTerm" 
                 (input)="filterPatients()"
                 placeholder="Rechercher un patient...">
          <button class="btn-primary" routerLink="/dashboard/patients/new">
            + Nouveau Patient
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom Complet</th>
              <th>CIN</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Genre</th>
              <th>RDV</th>
              <th>Dernier RDV</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let patient of filteredPatients">
              <td>{{ patient.id }}</td>
              <td>{{ patient.firstName }} {{ patient.lastName }}</td>
              <td>{{ patient.cin }}</td>
              <td>{{ patient.phone }}</td>
              <td>{{ patient.email }}</td>
              <td>
                <span class="gender-badge" [class.male]="patient.gender === 'M'"
                                           [class.female]="patient.gender === 'F'">
                  {{ patient.gender === 'M' ? 'Homme' : 'Femme' }}
                </span>
              </td>
              <td>
                <span class="appointment-count">{{ patient.appointmentsCount }}</span>
              </td>
              <td>{{ patient.lastAppointment | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button class="btn-view" 
                        [routerLink]="['/dashboard/patients', patient.id]">
                  👁️ Voir
                </button>
                <button class="btn-edit"
                        [routerLink]="['/dashboard/patients', patient.id, 'edit']">
                  ✏️ Modifier
                </button>
                <button class="btn-danger" 
                        (click)="deletePatient(patient.id)">
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredPatients.length === 0" class="no-data">
          <p>Aucun patient trouvé</p>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats">
        <div class="stat-card">
          <h4>Total Patients</h4>
          <p class="stat-number">{{ patients.length }}</p>
        </div>
        <div class="stat-card">
          <h4>Patients Hommes</h4>
          <p class="stat-number">{{ malePatientsCount }}</p>
        </div>
        <div class="stat-card">
          <h4>Patients Femmes</h4>
          <p class="stat-number">{{ femalePatientsCount }}</p>
        </div>
        <div class="stat-card">
          <h4>Nouveaux (30j)</h4>
          <p class="stat-number">{{ newPatientsCount }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patients-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    input {
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      width: 300px;
    }
    .btn-primary {
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .patients-table {
      width: 100%;
      border-collapse: collapse;
    }
    .patients-table th {
      background: #2c3e50;
      color: white;
      padding: 15px;
      text-align: left;
    }
    .patients-table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
    }
    .patients-table tr:hover {
      background: #f8f9fa;
    }
    .gender-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: bold;
    }
    .gender-badge.male {
      background: #d1ecf1;
      color: #0c5460;
    }
    .gender-badge.female {
      background: #f8d7da;
      color: #721c24;
    }
    .appointment-count {
      background: #3498db;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-weight: bold;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    .btn-view, .btn-edit, .btn-danger {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85em;
    }
    .btn-view {
      background: #17a2b8;
      color: white;
    }
    .btn-edit {
      background: #ffc107;
      color: #212529;
    }
    .btn-danger {
      background: #dc3545;
      color: white;
    }
    .no-data {
      text-align: center;
      padding: 40px;
      color: #6c757d;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 30px;
    }
    .stat-card {
      flex: 1;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card h4 {
      margin: 0 0 10px 0;
      color: #6c757d;
    }
    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #2c3e50;
      margin: 0;
    }
  `]
})
export class PatientsListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm = '';

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    // Mock data - À remplacer par appel API
    this.patients = [
      {
        id: 1,
        firstName: 'Mohamed',
        lastName: 'Alaoui',
        email: 'm.alaoui@email.com',
        phone: '0612345678',
        cin: 'AB123456',
        birthDate: new Date('1985-05-15'),
        gender: 'M',
        appointmentsCount: 5,
        lastAppointment: new Date('2024-01-15')
      },
      {
        id: 2,
        firstName: 'Fatima',
        lastName: 'Zahra',
        email: 'f.zahra@email.com',
        phone: '0623456789',
        cin: 'CD789012',
        birthDate: new Date('1990-08-22'),
        gender: 'F',
        appointmentsCount: 3,
        lastAppointment: new Date('2024-01-10')
      }
    ];
    this.filteredPatients = [...this.patients];
  }

  filterPatients() {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = [...this.patients];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(patient =>
      patient.firstName.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term) ||
      patient.cin.toLowerCase().includes(term) ||
      patient.email.toLowerCase().includes(term)
    );
  }

  deletePatient(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      this.patients = this.patients.filter(p => p.id !== id);
      this.filterPatients();
      console.log('Patient supprimé:', id);
    }
  }

  get malePatientsCount(): number {
    return this.patients.filter(p => p.gender === 'M').length;
  }

  get femalePatientsCount(): number {
    return this.patients.filter(p => p.gender === 'F').length;
  }

  get newPatientsCount(): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return this.patients.filter(p => p.lastAppointment >= thirtyDaysAgo).length;
  }
}