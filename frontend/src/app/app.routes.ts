import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'incidentes',
        loadComponent: () => import('./modules/incidentes/incidente-list/incidente-list.component').then(m => m.IncidenteListComponent)
      },
      {
        path: 'incidentes/nuevo',
        loadComponent: () => import('./modules/incidentes/incidente-form/incidente-form.component').then(m => m.IncidenteFormComponent)
      },
      {
        path: 'incidentes/:id',
        loadComponent: () => import('./modules/incidentes/incidente-detail/incidente-detail.component').then(m => m.IncidenteDetailComponent)
      },
      {
        path: 'incidentes/:id/editar',
        loadComponent: () => import('./modules/incidentes/incidente-form/incidente-form.component').then(m => m.IncidenteFormComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./modules/usuarios/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN')]
      },
      {
        path: 'recursos',
        loadComponent: () => import('./modules/recursos/recurso-list/recurso-list.component').then(m => m.RecursoListComponent),
        canActivate: [roleGuard('ADMIN', 'FINANZAS')]
      },
      {
        path: 'prioridades',
        loadComponent: () => import('./modules/prioridades/prioridad-list/prioridad-list.component').then(m => m.PrioridadListComponent),
        canActivate: [roleGuard('ADMIN', 'ANALISTA')]
      },
      {
        path: 'estados',
        loadComponent: () => import('./modules/estados/estado-list/estado-list.component').then(m => m.EstadoListComponent),
        canActivate: [roleGuard('ADMIN', 'ANALISTA')]
      },
      {
        path: 'reportes',
        loadComponent: () => import('./modules/reportes/reportes.component').then(m => m.ReportesComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
