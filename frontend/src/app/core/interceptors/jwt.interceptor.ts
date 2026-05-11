import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notification = inject(NotificationService);

  const token = authService.getToken();

  let authReq = req;
  if (token && !req.url.includes('/api/auth/login')) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        notification.error(error.error?.mensaje || error.error?.message || 'Debe autenticarse para acceder a este recurso.');
      } else if (error.status === 403) {
        notification.error(error.error?.mensaje || error.error?.message || 'Acceso denegado. No tiene permisos para esta acción.');
      } else if (error.status === 0) {
        notification.error('Error de conexión con el servidor.');
      }

      return throwError(() => error);
    })
  );
};
