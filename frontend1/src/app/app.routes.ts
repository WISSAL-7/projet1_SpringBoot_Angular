import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { TestPageComponent } from './test/test-page';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
   {
    path: 'auth',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard], // Protection
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: '/auth/login', // Redirection vers login
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/auth/login' // Redirection pour routes inconnues
  },
   {
    path: 'test',
    component: TestPageComponent  // Page de test
  },
];