import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    
    // Injecte le service d'authentification
    const authService = inject(AuthService);
    const token = authService.getToken();
    
    // Si l'URL de la requête est vers notre API et qu'un token existe
    const isApiUrl = req.url.startsWith('http://localhost:8080/api/');
    const isAuthUrl = req.url.includes('/api/auth/'); 
    
    if (token && isApiUrl && !isAuthUrl) {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(clonedRequest);
    }
    return next(req);
};