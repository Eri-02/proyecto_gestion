import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="login-wrapper">
      <!-- Animated background -->
      <div class="bg-grid"></div>
      <div class="bg-glow glow-1"></div>
      <div class="bg-glow glow-2"></div>
      <div class="bg-glow glow-3"></div>

      <div class="login-card">
        <!-- Logo -->
        <div class="login-header">
          <div class="shield-icon">
            <mat-icon>shield</mat-icon>
          </div>
          <h1>CyberShield</h1>
          <p>Sistema de Gestión de Incidentes</p>
        </div>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Usuario</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input matInput formControlName="username" placeholder="Ingrese su usuario" autocomplete="username">
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              El usuario es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input matInput [type]="hidePassword ? 'password' : 'text'"
                   formControlName="password" placeholder="Ingrese su contraseña" autocomplete="current-password">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" class="login-btn"
                  [disabled]="loginForm.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Iniciar Sesión</span>
          </button>
        </form>

        <div class="login-footer">
          <p>Acceso exclusivo para personal autorizado</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #080a12;
      position: relative;
      overflow: hidden;
    }

    /* ======== ANIMATED BACKGROUND ======== */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(79, 140, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(79, 140, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(60px, 60px); }
    }

    .bg-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.4;
      animation: glowPulse 6s ease-in-out infinite alternate;
    }

    .glow-1 {
      width: 400px; height: 400px;
      background: rgba(79, 140, 255, 0.3);
      top: -100px; left: -100px;
      animation-delay: 0s;
    }

    .glow-2 {
      width: 300px; height: 300px;
      background: rgba(0, 212, 255, 0.2);
      bottom: -50px; right: -50px;
      animation-delay: 2s;
    }

    .glow-3 {
      width: 250px; height: 250px;
      background: rgba(124, 92, 252, 0.2);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 4s;
    }

    @keyframes glowPulse {
      0% { opacity: 0.2; transform: scale(1); }
      100% { opacity: 0.5; transform: scale(1.15); }
    }

    /* ======== LOGIN CARD ======== */
    .login-card {
      position: relative;
      z-index: 2;
      width: 420px;
      max-width: 90vw;
      background: rgba(26, 29, 41, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(79, 140, 255, 0.15);
      border-radius: 20px;
      padding: 48px 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(79, 140, 255, 0.05);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .shield-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(79, 140, 255, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      border: 1px solid rgba(0, 212, 255, 0.2);

      mat-icon {
        font-size: 36px;
        width: 36px;
        height: 36px;
        color: var(--accent-cyan);
      }
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(135deg, #00d4ff, #4f8cff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .login-header p {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-top: 4px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    mat-form-field {
      width: 100%;
    }

    .login-btn {
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 12px;
      margin-top: 8px;
      background: linear-gradient(135deg, #4f8cff, #3d5afe) !important;
      transition: all var(--transition-normal);

      &:hover:not([disabled]) {
        box-shadow: 0 4px 20px rgba(79, 140, 255, 0.4);
        transform: translateY(-1px);
      }

      &[disabled] {
        opacity: 0.6;
      }

      mat-spinner {
        margin: 0 auto;
        ::ng-deep circle {
          stroke: white !important;
        }
      }
    }

    .login-footer {
      text-align: center;
      margin-top: 24px;
      p {
        color: var(--text-muted);
        font-size: 0.75rem;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    // If already logged in, redirect
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getDefaultRoute()]);
    }

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.notification.success('¡Bienvenido!');
        this.router.navigate([this.authService.getDefaultRoute()]);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.mensaje || err.error?.message || 'Credenciales incorrectas';
        this.notification.error(msg);
      }
    });
  }
}
