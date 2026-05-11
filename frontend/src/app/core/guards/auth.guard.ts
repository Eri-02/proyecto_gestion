import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const roleGuard = (...allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (authService.hasRole(...allowedRoles)) {
      return true;
    }

    router.navigate([authService.getDefaultRoute()]);
    return false;
  };
};
