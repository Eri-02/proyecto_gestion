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
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'FINANZAS')]
      },
      {
        path: 'incidentes',
        loadComponent: () => import('./modules/incidentes/incidente-list/incidente-list.component').then(m => m.IncidenteListComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'ANALISTA')]
      },
      {
        path: 'incidentes/nuevo',
        loadComponent: () => import('./modules/incidentes/incidente-form/incidente-form.component').then(m => m.IncidenteFormComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'ANALISTA')]
      },
      {
        path: 'incidentes/:id',
        loadComponent: () => import('./modules/incidentes/incidente-detail/incidente-detail.component').then(m => m.IncidenteDetailComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'ANALISTA')]
      },
      {
        path: 'incidentes/:id/editar',
        loadComponent: () => import('./modules/incidentes/incidente-form/incidente-form.component').then(m => m.IncidenteFormComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'ANALISTA')]
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
        path: 'auditoria-financiera',
        loadComponent: () => import('./modules/auditoria-financiera/auditoria-financiera.component').then(m => m.AuditoriaFinancieraComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN')]
      },
      {
        path: 'presupuestos',
        loadComponent: () => import('./modules/presupuestos/presupuesto-list/presupuesto-list.component').then(m => m.PresupuestoListComponent),
        canActivate: [roleGuard('ADMIN', 'FINANZAS')]
      },
      {
        path: 'presupuestos/nuevo',
        loadComponent: () => import('./modules/presupuestos/presupuesto-form/presupuesto-form.component').then(m => m.PresupuestoFormComponent),
        canActivate: [roleGuard('ADMIN', 'FINANZAS')]
      },
      {
        path: 'presupuestos/:id/editar',
        loadComponent: () => import('./modules/presupuestos/presupuesto-form/presupuesto-form.component').then(m => m.PresupuestoFormComponent),
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
        loadComponent: () => import('./modules/reportes/reportes.component').then(m => m.ReportesComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'FINANZAS', 'ANALISTA')]
      },
      {
        path: 'reportes/analistas',
        loadComponent: () => import('./modules/reportes/analista-desempeno/analista-desempeno.component').then(m => m.AnalistaDesempenoComponent),
        canActivate: [roleGuard('ADMIN', 'SUPER_ADMIN', 'DIRECTOR', 'FINANZAS', 'ANALISTA')]
      },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];
