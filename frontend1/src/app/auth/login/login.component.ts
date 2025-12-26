import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  username = '';
  password = '';

  constructor(private auth: AuthService) {}

  login(){
    this.auth.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res as any);
        alert('Login OK');
      },
      error: () => alert('Erreur login')
    });
  }
}
