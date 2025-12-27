// src/app/dashboard/pages/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-page">
      <h1>Bienvenue sur votre tableau de bord</h1>
      <div class="stats">
        <div class="stat-card">
          <h3>Rendez-vous à venir</h3>
          <p class="count">5</p>
        </div>
        <div class="stat-card">
          <h3>Rendez-vous passés</h3>
          <p class="count">12</p>
        </div>
        <div class="stat-card">
          <h3>Médecins</h3>
          <p class="count">3</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      padding: 20px;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-top: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      flex: 1;
    }
    .stat-card h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
    }
    .count {
      font-size: 2em;
      font-weight: bold;
      color: #3498db;
      margin: 0;
    }
  `]
})
export class HomeComponent {}