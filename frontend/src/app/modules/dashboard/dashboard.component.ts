import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { IncidenteService } from '../../core/services/incidente.service';
import { DashboardResponse, IncidenteCritico } from '../../core/models/dashboard.model';
import { IncidenteResponse } from '../../core/models/incidente.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatTableModule,
    MatProgressSpinnerModule, MatButtonModule, MatChipsModule,
    BaseChartDirective, DecimalPipe, CurrencyPipe
  ],
  template: `
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1>Dashboard</h1>
      </div>

      <div *ngIf="loading" class="loading-shade">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div *ngIf="!loading">
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card" style="--card-gradient: var(--gradient-orange)">
            <div class="kpi-icon"><mat-icon>schedule</mat-icon></div>
            <div class="kpi-content">
              <span class="kpi-value">{{ data?.mttrHoras | number:'1.1-1' }}h</span>
              <span class="kpi-label">MTTR Promedio</span>
            </div>
          </div>

          <div class="kpi-card" [style.--card-gradient]="(data?.desviacionPromedio ?? 0) > 0 ? 'var(--gradient-red)' : 'var(--gradient-green)'">
            <div class="kpi-icon"><mat-icon>trending_up</mat-icon></div>
            <div class="kpi-content">
              <span class="kpi-value">{{ data?.desviacionPromedio | number:'1.1-1' }}%</span>
              <span class="kpi-label">Desviación Promedio</span>
            </div>
          </div>

          <div class="kpi-card" style="--card-gradient: var(--gradient-blue)">
            <div class="kpi-icon"><mat-icon>bug_report</mat-icon></div>
            <div class="kpi-content">
              <span class="kpi-value">{{ data?.incidentesActivos }}</span>
              <span class="kpi-label">Incidentes Activos</span>
            </div>
          </div>

          <div class="kpi-card" style="--card-gradient: var(--gradient-red)">
            <div class="kpi-icon"><mat-icon>warning</mat-icon></div>
            <div class="kpi-content">
              <span class="kpi-value">{{ data?.incidentesCriticos }}</span>
              <span class="kpi-label">Incidentes Críticos</span>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="finance-grid">
          <div class="finance-card">
            <mat-icon>account_balance_wallet</mat-icon>
            <div>
              <span class="finance-value">{{ data?.costoEstimadoTotal | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="finance-label">Costo Estimado Total</span>
            </div>
          </div>
          <div class="finance-card">
            <mat-icon>payments</mat-icon>
            <div>
              <span class="finance-value">{{ data?.costoRealTotal | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="finance-label">Costo Real Total</span>
            </div>
          </div>
          <div class="finance-card">
            <mat-icon>attach_money</mat-icon>
            <div>
              <span class="finance-value">{{ data?.ingresosTotal | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="finance-label">Ingresos Total</span>
            </div>
          </div>
          <div class="finance-card">
            <mat-icon>show_chart</mat-icon>
            <div>
              <span class="finance-value" [class.text-positive]="(data?.margenTotal ?? 0) >= 0"
                    [class.text-negative]="(data?.margenTotal ?? 0) < 0">
                {{ data?.margenTotal | currency:'USD':'symbol':'1.0-0' }}
              </span>
              <span class="finance-label">Margen Total</span>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
          <div class="card chart-card">
            <h3>Distribución por Prioridad</h3>
            <div class="chart-container" *ngIf="priorityChartData">
              <canvas baseChart
                [data]="priorityChartData"
                [options]="doughnutOptions"
                type="doughnut">
              </canvas>
            </div>
          </div>

          <div class="card chart-card">
            <h3>Distribución por Estado</h3>
            <div class="chart-container" *ngIf="stateChartData">
              <canvas baseChart
                [data]="stateChartData"
                [options]="doughnutOptions"
                type="doughnut">
              </canvas>
            </div>
          </div>

          <div class="card chart-card wide">
            <h3>Costos: Estimado vs Real por Incidente</h3>
            <div class="chart-container-wide" *ngIf="costChartData">
              <canvas baseChart
                [data]="costChartData"
                [options]="barOptions"
                type="bar">
              </canvas>
            </div>
          </div>
        </div>

        <!-- Critical Incidents Table -->
        <div class="card table-card" *ngIf="data?.listaIncidentesCriticos?.length">
          <div class="table-header">
            <h3>
              <mat-icon>warning</mat-icon>
              Incidentes Críticos (Desviación > 15%)
            </h3>
          </div>

          <table mat-table [dataSource]="data!.listaIncidentesCriticos" class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let e">#{{ e.id }}</td>
            </ng-container>

            <ng-container matColumnDef="titulo">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let e" class="cell-title">{{ e.titulo }}</td>
            </ng-container>

            <ng-container matColumnDef="costoEstimado">
              <th mat-header-cell *matHeaderCellDef>Estimado</th>
              <td mat-cell *matCellDef="let e">{{ e.costoEstimado | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>

            <ng-container matColumnDef="costoReal">
              <th mat-header-cell *matHeaderCellDef>Real</th>
              <td mat-cell *matCellDef="let e">{{ e.costoReal | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>

            <ng-container matColumnDef="desviacion">
              <th mat-header-cell *matHeaderCellDef>Desviación</th>
              <td mat-cell *matCellDef="let e">
                <span class="chip chip-critica">{{ e.desviacionPorcentual | number:'1.1-1' }}%</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="margen">
              <th mat-header-cell *matHeaderCellDef>Margen</th>
              <td mat-cell *matCellDef="let e"
                  [class.text-positive]="e.margenPorcentual >= 0"
                  [class.text-negative]="e.margenPorcentual < 0">
                {{ e.margenPorcentual | number:'1.1-1' }}%
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="criticalColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: criticalColumns;"
                (click)="goToIncident(row.id)" class="clickable-row"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all var(--transition-normal);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--card-gradient);
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .kpi-icon {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: var(--card-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        color: white;
        font-size: 26px;
        width: 26px;
        height: 26px;
      }
    }

    .kpi-content {
      display: flex;
      flex-direction: column;
    }

    .kpi-value {
      font-size: 1.75rem;
      font-weight: 800;
      line-height: 1;
    }

    .kpi-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    /* Finance Grid */
    .finance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .finance-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-sm);
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;

      mat-icon {
        color: var(--accent-cyan);
        font-size: 24px;
      }

      div {
        display: flex;
        flex-direction: column;
      }
    }

    .finance-value {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .finance-label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    /* Charts */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-card {
      h3 {
        margin: 0 0 16px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-secondary);
      }

      &.wide {
        grid-column: 1 / -1;
      }
    }

    .chart-container {
      height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chart-container-wide {
      height: 300px;
      position: relative;
    }

    /* Table */
    .table-card {
      margin-bottom: 24px;
    }

    .table-header {
      margin-bottom: 16px;
      h3 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--accent-red);
        margin: 0;
        mat-icon { font-size: 20px; width: 20px; height: 20px; }
      }
    }

    .full-width { width: 100%; }

    .cell-title {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .clickable-row { cursor: pointer; }

    .loading-shade {
      position: relative;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
      .kpi-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .kpi-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  data: DashboardResponse | null = null;
  incidentes: IncidenteResponse[] = [];
  loading = true;

  criticalColumns = ['id', 'titulo', 'costoEstimado', 'costoReal', 'desviacion', 'margen'];

  // Chart configurations
  priorityChartData: ChartData<'doughnut'> | null = null;
  stateChartData: ChartData<'doughnut'> | null = null;
  costChartData: ChartData<'bar'> | null = null;

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9aa0b0', padding: 16, usePointStyle: true, pointStyle: 'circle' }
      }
    },
    cutout: '65%'
  };

  barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9aa0b0', usePointStyle: true, pointStyle: 'circle' }
      }
    },
    scales: {
      x: { ticks: { color: '#6b7185' }, grid: { color: 'rgba(45,51,72,0.5)' } },
      y: { ticks: { color: '#6b7185' }, grid: { color: 'rgba(45,51,72,0.5)' } }
    }
  };

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private incidenteService: IncidenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.dashboardService.getResumen().subscribe({
      next: (data) => {
        this.data = data;
        this.loadIncidentsForCharts();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadIncidentsForCharts(): void {
    if (!this.authService.canAccessIncidentes()) {
      this.buildChartsFromDashboard();
      this.loading = false;
      return;
    }

    this.incidenteService.getAll().subscribe({
      next: (incidentes) => {
        this.incidentes = incidentes;
        this.buildCharts();
        this.loading = false;
      },
      error: () => {
        this.buildChartsFromDashboard();
        this.loading = false;
      }
    });
  }

  buildCharts(): void {
    // Priority distribution
    const priorityCounts: Record<string, number> = {};
    this.incidentes.forEach(i => {
      const name = i.prioridadNombre || 'Sin prioridad';
      priorityCounts[name] = (priorityCounts[name] || 0) + 1;
    });

    this.priorityChartData = {
      labels: Object.keys(priorityCounts),
      datasets: [{
        data: Object.values(priorityCounts),
        backgroundColor: ['#00c853', '#4f8cff', '#ffc107', '#ff3d57'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    };

    // State distribution
    const stateCounts: Record<string, number> = {};
    this.incidentes.forEach(i => {
      const name = i.estadoNombre || 'Sin estado';
      stateCounts[name] = (stateCounts[name] || 0) + 1;
    });

    this.stateChartData = {
      labels: Object.keys(stateCounts),
      datasets: [{
        data: Object.values(stateCounts),
        backgroundColor: ['#00d4ff', '#ff9100', '#00c853', '#6b7185', '#7c5cfc'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    };

    // Cost comparison bar chart (top 10)
    const top = this.incidentes.slice(0, 10);
    this.costChartData = {
      labels: top.map(i => i.titulo?.substring(0, 20) + (i.titulo?.length > 20 ? '...' : '')),
      datasets: [
        {
          label: 'Estimado',
          data: top.map(i => i.costoEstimado || 0),
          backgroundColor: 'rgba(79, 140, 255, 0.7)',
          borderRadius: 6
        },
        {
          label: 'Real',
          data: top.map(i => i.costoReal || 0),
          backgroundColor: 'rgba(255, 61, 87, 0.7)',
          borderRadius: 6
        }
      ]
    };
  }

  buildChartsFromDashboard(): void {
    // Fallback when incidents list is unavailable
    this.priorityChartData = {
      labels: ['Activos', 'Críticos', 'Otros'],
      datasets: [{
        data: [
          this.data?.incidentesActivos || 0,
          this.data?.incidentesCriticos || 0,
          Math.max(0, (this.data?.totalIncidentes || 0) - (this.data?.incidentesActivos || 0))
        ],
        backgroundColor: ['#4f8cff', '#ff3d57', '#6b7185'],
        borderWidth: 0
      }]
    };

    this.stateChartData = this.priorityChartData;

    this.costChartData = {
      labels: ['Estimado Total', 'Real Total', 'Margen Total'],
      datasets: [{
        label: 'Resumen financiero',
        data: [
          this.data?.costoEstimadoTotal || 0,
          this.data?.costoRealTotal || 0,
          this.data?.margenTotal || 0
        ],
        backgroundColor: [
          'rgba(79, 140, 255, 0.7)',
          'rgba(255, 61, 87, 0.7)',
          'rgba(0, 200, 83, 0.7)'
        ],
        borderRadius: 6
      }]
    };
  }

  goToIncident(id: number): void {
    this.router.navigate(['/incidentes', id]);
  }
}
