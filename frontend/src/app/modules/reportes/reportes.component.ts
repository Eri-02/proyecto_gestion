import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { IncidenteService } from '../../core/services/incidente.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';
import { IncidenteResponse } from '../../core/models/incidente.model';
import { DashboardResponse } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatProgressSpinnerModule, MatDividerModule,
    CurrencyPipe, DatePipe, DecimalPipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Reportes</h1>
        <div class="header-actions">
          <button mat-flat-button color="primary" (click)="exportCSV()" [disabled]="!incidentes.length">
            <mat-icon>download</mat-icon> Exportar CSV
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading-shade">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading">
        <!-- Financial Summary Cards -->
        <div class="summary-grid" *ngIf="dashboard">
          <div class="summary-card">
            <mat-icon>assessment</mat-icon>
            <div class="summary-info">
              <span class="summary-value">{{ dashboard.totalIncidentes }}</span>
              <span class="summary-label">Total Incidentes</span>
            </div>
          </div>
          <div class="summary-card">
            <mat-icon>account_balance_wallet</mat-icon>
            <div class="summary-info">
              <span class="summary-value">{{ dashboard.costoEstimadoTotal | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="summary-label">Costo Estimado Total</span>
            </div>
          </div>
          <div class="summary-card">
            <mat-icon>payments</mat-icon>
            <div class="summary-info">
              <span class="summary-value">{{ dashboard.costoRealTotal | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="summary-label">Costo Real Total</span>
            </div>
          </div>
          <div class="summary-card">
            <mat-icon>show_chart</mat-icon>
            <div class="summary-info">
              <span class="summary-value" [class.text-positive]="dashboard.margenTotal >= 0"
                    [class.text-negative]="dashboard.margenTotal < 0">
                {{ dashboard.margenTotal | currency:'USD':'symbol':'1.0-0' }}
              </span>
              <span class="summary-label">Margen Total</span>
            </div>
          </div>
        </div>

        <!-- Financial Report Table -->
        <div class="card">
          <h3 class="section-title">
            <mat-icon>receipt_long</mat-icon> Reporte Financiero de Incidentes
          </h3>
          <mat-divider></mat-divider>

          <table mat-table [dataSource]="incidentes" class="full-width" *ngIf="incidentes.length">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let i">#{{ i.id }}</td>
            </ng-container>
            <ng-container matColumnDef="titulo">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let i" class="cell-title">{{ i.titulo }}</td>
            </ng-container>
            <ng-container matColumnDef="prioridad">
              <th mat-header-cell *matHeaderCellDef>Prioridad</th>
              <td mat-cell *matCellDef="let i">{{ i.prioridadNombre }}</td>
            </ng-container>
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let i">{{ i.estadoNombre }}</td>
            </ng-container>
            <ng-container matColumnDef="costoEstimado">
              <th mat-header-cell *matHeaderCellDef>Estimado</th>
              <td mat-cell *matCellDef="let i">{{ i.costoEstimado | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>
            <ng-container matColumnDef="costoReal">
              <th mat-header-cell *matHeaderCellDef>Real</th>
              <td mat-cell *matCellDef="let i">{{ i.costoReal | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>
            <ng-container matColumnDef="desviacion">
              <th mat-header-cell *matHeaderCellDef>Desviación</th>
              <td mat-cell *matCellDef="let i"
                  [class.text-negative]="i.desviacionPorcentual > 15"
                  [class.text-warning]="i.desviacionPorcentual > 0 && i.desviacionPorcentual <= 15"
                  [class.text-positive]="i.desviacionPorcentual <= 0">
                {{ i.desviacionPorcentual | number:'1.1-1' }}%
              </td>
            </ng-container>
            <ng-container matColumnDef="ingresos">
              <th mat-header-cell *matHeaderCellDef>Ingresos</th>
              <td mat-cell *matCellDef="let i">{{ i.ingresos | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>
            <ng-container matColumnDef="margen">
              <th mat-header-cell *matHeaderCellDef>Margen</th>
              <td mat-cell *matCellDef="let i"
                  [class.text-positive]="i.margenAbsoluto >= 0"
                  [class.text-negative]="i.margenAbsoluto < 0">
                {{ i.margenAbsoluto | currency:'USD':'symbol':'1.0-0' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
          </table>

          <p *ngIf="!incidentes.length" class="empty-msg">No hay incidentes para mostrar</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-actions {
      display: flex;
      gap: 10px;
      button { border-radius: 12px; font-weight: 600; mat-icon { margin-right: 4px; } }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;

      mat-icon { font-size: 28px; width: 28px; height: 28px; color: var(--accent-cyan); }
    }

    .summary-info { display: flex; flex-direction: column; }
    .summary-value { font-size: 1.25rem; font-weight: 700; }
    .summary-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }

    .section-title {
      display: flex; align-items: center; gap: 8px;
      margin: 0 0 12px; padding: 16px 24px 0;
      font-size: 1rem; font-weight: 600; color: var(--text-secondary);
      mat-icon { color: var(--accent-cyan); }
    }

    .full-width { width: 100%; }
    .cell-title { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty-msg { text-align: center; padding: 32px; color: var(--text-muted); }
    .loading-shade { min-height: 300px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class ReportesComponent implements OnInit {
  incidentes: IncidenteResponse[] = [];
  dashboard: DashboardResponse | null = null;
  loading = true;
  reportColumns = ['id', 'titulo', 'prioridad', 'estado', 'costoEstimado', 'costoReal', 'desviacion', 'ingresos', 'margen'];

  constructor(
    private incidenteService: IncidenteService,
    private dashboardService: DashboardService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.incidenteService.getAll().subscribe({
      next: (data) => {
        this.incidentes = data;
        this.dashboardService.getResumen().subscribe({
          next: (d) => { this.dashboard = d; this.loading = false; },
          error: () => { this.loading = false; }
        });
      },
      error: () => {
        this.notification.error('Error al cargar datos');
        this.loading = false;
      }
    });
  }

  exportCSV(): void {
    if (!this.incidentes.length) return;

    const headers = ['ID', 'Título', 'Prioridad', 'Estado', 'Costo Estimado', 'Costo Real', 'Desviación %', 'Ingresos', 'Margen', 'Cliente', 'Sistema', 'Fecha Creación'];
    const rows = this.incidentes.map(i => [
      i.id, `"${i.titulo}"`, i.prioridadNombre, i.estadoNombre,
      i.costoEstimado, i.costoReal, i.desviacionPorcentual,
      i.ingresos, i.margenAbsoluto, `"${i.cliente || ''}"`,
      `"${i.sistemaAfectado || ''}"`, i.fechaCreacion
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_incidentes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    this.notification.success('Reporte exportado correctamente');
  }
}
