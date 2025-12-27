import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Vérifier les rôles si spécifiés dans la route
          const requiredRoles = route.data['roles'] as Array<string>;
          if (requiredRoles) {
            const userRole = this.authService.getUserRole();
            if (userRole && requiredRoles.includes(userRole)) {
              return true;
            }
            // Rediriger vers page non autorisée
            return this.router.createUrlTree(['/unauthorized']);
          }
          return true;
        }
        
        // Rediriger vers login avec l'URL de retour
        return this.router.createUrlTree(
          ['/auth/login'], 
          { queryParams: { returnUrl: state.url } }
        );
      })
    );
  }
}