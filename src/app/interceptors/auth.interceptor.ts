import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

  // Rotas públicas do auth e agendamentos públicas não exigem necessariamente o token, 
  // mas se o token existir ou for uma rota protegida, injetamos no cabeçalho Authorization.
  if (token && !req.url.includes('/api/auth/')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
