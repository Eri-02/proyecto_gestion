import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatSidenavModule, MatToolbarModule,
    MatListModule, MatIconModule, MatButtonModule, MatMenuModule,
    MatDividerModule, MatTooltipModule
  ],
  template: `
    <mat-sidenav-container class="layout-container" [autosize]="true">
      <!-- SIDEBAR -->
      <mat-sidenav #sidenav [mode]="isMobile ? 'over' : 'side'" [opened]="!isMobile"
                   class="sidebar" [class.collapsed]="isCollapsed && !isMobile">
        <!-- Logo -->
        <div class="sidebar-header">
          <div class="logo-container">
            <mat-icon class="logo-icon">shield</mat-icon>
            <span class="logo-text" *ngIf="!isCollapsed || isMobile">CyberShield</span>
          </div>
          <button mat-icon-button class="collapse-btn" *ngIf="!isMobile" (click)="toggleDesktopSidebar($event)">
            <mat-icon>{{ isCollapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </button>
        </div>

        <mat-divider></mat-divider>

        <!-- Navigation -->
        <mat-nav-list class="nav-list">
          <ng-container *ngFor="let item of filteredNavItems">
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link"
               [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
               (click)="isMobile && sidenav.close()"
               [matTooltip]="isCollapsed && !isMobile ? item.label : ''"
               matTooltipPosition="right">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle *ngIf="!isCollapsed || isMobile">{{ item.label }}</span>
            </a>
          </ng-container>
        </mat-nav-list>

        <!-- Bottom section -->
        <div class="sidebar-footer">
          <mat-divider></mat-divider>
          <div class="user-mini" *ngIf="!isCollapsed || isMobile">
            <div class="avatar-mini">{{ userInitial }}</div>
            <div class="user-mini-info">
              <span class="user-mini-name">{{ userName }}</span>
              <span class="user-mini-role">{{ userRole }}</span>
            </div>
          </div>
        </div>
      </mat-sidenav>

      <!-- MAIN CONTENT -->
      <mat-sidenav-content class="main-content">
        <!-- Top Toolbar -->
        <mat-toolbar class="top-toolbar">
          <button mat-icon-button (click)="toggleSidebar()">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="toolbar-spacer"></span>

          <!-- User Menu -->
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
            <div class="avatar">{{ userInitial }}</div>
            <span class="user-name">{{ userName }}</span>
            <mat-icon>arrow_drop_down</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="menu-header">
              <strong>{{ userName }}</strong>
              <small>{{ userRole }}</small>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .layout-container {
      height: 100vh;
      width: 100%;
    }

    /* ======== SIDEBAR ======== */
    .sidebar {
      width: 260px;
      background: var(--bg-secondary);
      border-right: 1px solid var(--border-color);
      transition: width var(--transition-normal);
      overflow-x: hidden;

      &.collapsed {
        width: 68px;
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      cursor: pointer;
      min-height: 64px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      color: var(--accent-cyan);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .logo-text {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .collapse-btn {
      color: var(--text-muted);
    }

    .nav-list {
      padding: 8px;

      a {
        border-radius: var(--border-radius-sm) !important;
        margin-bottom: 4px;
        color: var(--text-secondary);
        transition: all var(--transition-fast);

        mat-icon {
          color: var(--text-muted);
          margin-right: 12px;
        }

        &:hover {
          background: var(--bg-card) !important;
          color: var(--text-primary);
          mat-icon { color: var(--accent-cyan); }
        }

        &.active-link {
          background: rgba(0, 212, 255, 0.1) !important;
          color: var(--accent-cyan) !important;
          mat-icon { color: var(--accent-cyan) !important; }
        }
      }
    }

    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 16px;
    }

    .user-mini {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .avatar-mini {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--gradient-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      flex-shrink: 0;
    }

    .user-mini-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .user-mini-name {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-mini-role {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* ======== TOOLBAR ======== */
    .top-toolbar {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      height: 64px;
      color: var(--text-primary);
      padding: 0 16px;
    }

    .toolbar-spacer { flex: 1 1 auto; }

    .user-menu-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-primary);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gradient-purple);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
      color: white;
    }

    .user-name {
      font-size: 0.85rem;
      font-weight: 500;
    }

    .menu-header {
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      strong { font-size: 0.9rem; }
      small { color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
    }

    /* ======== CONTENT ======== */
    .main-content {
      background: var(--bg-primary);
      transition: margin-left var(--transition-normal);
    }

    .content-area {
      height: calc(100vh - 64px);
      overflow-y: auto;
      padding: 0;
    }

    /* ======== RESPONSIVE ======== */
    @media (max-width: 768px) {
      .sidebar { width: 260px !important; }
      .user-name { display: none; }
    }
  `]
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  isCollapsed = false;
  userName = '';
  userRole = '';
  userInitial = '';

  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard', roles: ['ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'FINANZAS'] },
    { icon: 'bug_report', label: 'Incidentes', route: '/incidentes', roles: ['ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'ANALISTA'] },
    { icon: 'people', label: 'Usuarios', route: '/usuarios', roles: ['ADMIN', 'SUPER_ADMIN'] },
    { icon: 'engineering', label: 'Recursos', route: '/recursos', roles: ['ADMIN', 'FINANZAS', 'SUPER_ADMIN'] },
    { icon: 'account_balance_wallet', label: 'Presupuestos', route: '/presupuestos', roles: ['ADMIN', 'FINANZAS'] },
    { icon: 'manage_search', label: 'Auditoría', route: '/auditoria-financiera', roles: ['ADMIN', 'SUPER_ADMIN'] },
    { icon: 'flag', label: 'Prioridades', route: '/prioridades', roles: ['ADMIN', 'ANALISTA', 'SUPER_ADMIN'] },
    { icon: 'label', label: 'Estados', route: '/estados', roles: ['ADMIN', 'ANALISTA', 'SUPER_ADMIN'] },
    { icon: 'assessment', label: 'Reportes', route: '/reportes', roles: ['ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'FINANZAS', 'ANALISTA'] },
    { icon: 'analytics', label: 'Desempeño', route: '/reportes/analistas', roles: ['ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'FINANZAS', 'ANALISTA'] },
  ];

  filteredNavItems: NavItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.userName = user?.nombreCompleto || user?.username || 'Usuario';
    this.userRole = user?.rol || '';
    this.userInitial = this.userName.charAt(0).toUpperCase();

    this.filteredNavItems = this.navItems.filter(item => {
      if (!item.roles) return true;
      return this.authService.hasRole(...item.roles);
    });

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
      if (this.isMobile) {
        this.isCollapsed = false;
      }
    });
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.sidenav.toggle();
      return;
    }

    this.isCollapsed = !this.isCollapsed;
  }

  toggleDesktopSidebar(event: Event): void {
    event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
