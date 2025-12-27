// src/app/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home.components';
import { PatientsListComponent } from './pages/patients-list.component';
import { AdminPanelComponent } from './pages/admin-panel.component';
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { roles: ['PATIENT', 'DOCTOR', 'ADMIN'] }
      },
      {
        path: 'patients',
        component: PatientsListComponent,
        data: { roles: ['DOCTOR', 'ADMIN'] } // Seulement médecins et admin
      },
      {
        path: 'admin',
        component: AdminPanelComponent,
        data: { roles: ['ADMIN'] } // Seulement admin
      }
    ]
  }
];