import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.usuarioId,
          username: response.username,
          nombreCompleto: response.nombreCompleto,
          email: response.email,
          rol: response.rol,
          nivelPermiso: response.nivelPermiso
        }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number {
    return this.getUser()?.id ?? 0;
  }

  getUserRole(): string {
    return this.getUser()?.rol ?? '';
  }

  getUserName(): string {
    return this.getUser()?.nombreCompleto ?? '';
  }

  hasRole(...roles: string[]): boolean {
    const userRole = this.getUserRole();
    return roles.some(r => userRole.toUpperCase().includes(r.toUpperCase()));
  }
}
