import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  specialties?: string[]; // Pour les médecins
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR';
  cin?: string; // Pour les médecins
  specialty?: string; // Pour les médecins
}
export interface RegisterResponse {
  message: string;
  userId: number;
  email: string;
  token?: string; // Si le backend retourne un token directement
   role?: string;
  // Pour les erreurs
  error?: string;
  status?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';
  
  // Observable pour l'état d'authentification
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Connexion utilisateur
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveAuthData(response);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(response);
      })
    );
  }

  /**
   * Inscription utilisateur
   */
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Récupérer le token JWT
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Récupérer l'utilisateur connecté
   */
  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Rafraîchir le token
   */
  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  /**
   * Récupérer le rôle de l'utilisateur
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Méthodes privées
  private saveAuthData(response: LoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(response));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(this.userKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private getUserFromStorage(): LoginResponse | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    // Décoder le token JWT pour vérifier l'expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      return true;
    }
  }

  /**
   * Initialiser l'authentification au démarrage de l'application
   */
  initializeAuth(): void {
    if (this.isLoggedIn()) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.logout();
    }
  }
  // Ajoutez cette méthode APRES la méthode register() existante

/**
 * Inscription puis connexion automatique
 */
registerAndLogin(userData: RegisterRequest): Observable<any> {
  return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData).pipe(
    
    switchMap((registerResponse: RegisterResponse) => {
      console.log('Inscription réussie:', registerResponse);
      
      // Si le backend retourne un token directement
      if (registerResponse.token) {
        // Sauvegarder les données d'authentification
        const authData: LoginResponse = {
          token: registerResponse.token,
          refreshToken: '', // Vous pouvez ajuster selon votre backend
          userId: registerResponse.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        };
        
        this.saveAuthData(authData);
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(authData);
        
        return of(authData);
      } 
      // Sinon, on fait un login automatique après l'inscription
      else {
        console.log('Pas de token reçu, tentative de login automatique...');
        return this.login({
          email: userData.email,
          password: userData.password
        });
      }
    }),
    catchError(error => {
      console.error('Erreur lors de registerAndLogin:', error);
      return throwError(() => error);
    })
  );
}
  
  // Méthode pour simuler une connexion rapide (TEST)
  quickLogin(role: 'PATIENT' | 'DOCTOR' | 'ADMIN') {
    const mockUsers = {
      PATIENT: {
        token: 'mock_token_patient_123',
        user: {
          id: 1,
          email: 'patient@test.com',
          firstName: 'Jean',
          lastName: 'Dupont',
          role: 'PATIENT'
        }
      },
      DOCTOR: {
        token: 'mock_token_doctor_123',
        user: {
          id: 2,
          email: 'docteur@test.com',
          firstName: 'Dr. Marie',
          lastName: 'Martin',
          role: 'DOCTOR'
        }
      },
      ADMIN: {
        token: 'mock_token_admin_123',
        user: {
          id: 3,
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'System',
          role: 'ADMIN'
        }
      }
    };

    const data = mockUsers[role];
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    
    // Recharger la page pour voir les changements
    window.location.reload();
  }

  // Méthode pour reset (déconnexion)
  quickLogout() {
    localStorage.clear();
    window.location.reload();
  }
}
