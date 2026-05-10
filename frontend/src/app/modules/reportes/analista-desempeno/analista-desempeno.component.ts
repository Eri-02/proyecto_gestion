import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, PercentPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

// Charts
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

// Services & Models
import { ReportesService } from '../../../core/services/reportes.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AnalistaDesempeno } from '../../../core/models/reportes.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-analista-desempeno',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatProgressSpinnerModule, MatDividerModule, MatFormFieldModule,
    MatDatepickerModule, MatNativeDateModule, MatTooltipModule,
    BaseChartDirective, DecimalPipe, PercentPipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Desempeño de Analistas</h1>
        <div class="header-actions">
           <span class="user-info" *ngIf="isAnalista">Métricas Propias</span>
        </div>
      </div>

      <!-- Filtros -->
      <mat-card class="filter-card">
        <mat-card-content>
          <form [formGroup]="filterForm" class="filter-form">
            <mat-form-field appearance="outline">
              <mat-label>Rango de Fechas</mat-label>
              <mat-date-range-input [rangePicker]="picker">
                <input matStartDate formControlName="inicio" placeholder="Inicio">
                <input matEndDate formControlName="fin" placeholder="Fin">
              </mat-date-range-input>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-date-range-picker #picker></mat-date-range-picker>
            </mat-form-field>

            <div class="filter-actions">
              <button mat-flat-button color="accent" (click)="cargarDesempeno()">
                <mat-icon>refresh</mat-icon> Actualizar
              </button>
              <button mat-button (click)="limpiarFiltros()">Limpiar</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div *ngIf="loading" class="loading-shade">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="!loading">
        <!-- Gráficos de Comparación -->
        <div class="charts-row" *ngIf="!isAnalista">
          <div class="card chart-box">
            <h3>Incidentes Resueltos por Analista</h3>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="resolvedChartData"
                [options]="barChartOptions"
                [type]="'bar'">
              </canvas>
            </div>
          </div>
          <div class="card chart-box">
            <h3>Tasa de Éxito y Eficiencia</h3>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="efficiencyChartData"
                [options]="horizontalBarOptions"
                [type]="'bar'">
              </canvas>
            </div>
          </div>
        </div>

        <!-- Tabla Comparativa -->
        <div class="card table-container">
          <h3 class="section-title">
            <mat-icon>analytics</mat-icon> Comparativa de Rendimiento
          </h3>
          <mat-divider></mat-divider>

          <table mat-table [dataSource]="analistas" class="full-width">
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Analista</th>
              <td mat-cell *matCellDef="let a">
                <div class="analista-cell">
                  <div class="avatar">{{ a.nombre.charAt(0) }}</div>
                  <div class="info">
                    <span class="name">{{ a.nombre }}</span>
                    <span class="cargo">{{ a.cargo }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="resueltos">
              <th mat-header-cell *matHeaderCellDef>Resueltos</th>
              <td mat-cell *matCellDef="let a" class="text-center">
                <span class="count-badge">{{ a.incidentesResueltos }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="asignados">
              <th mat-header-cell *matHeaderCellDef>Asignados</th>
              <td mat-cell *matCellDef="let a" class="text-center">{{ a.incidentesAsignados }}</td>
            </ng-container>

            <ng-container matColumnDef="tiempoPromedio">
              <th mat-header-cell *matHeaderCellDef>Tiempo Promedio</th>
              <td mat-cell *matCellDef="let a">
                <div class="time-metric">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ a.tiempoPromedioResolucionHoras | number:'1.1-1' }}h</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="tasaExito">
              <th mat-header-cell *matHeaderCellDef>Tasa Éxito</th>
              <td mat-cell *matCellDef="let a">
                <div class="progress-wrapper">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width]="a.tasaExito + '%'" 
                         [class.low]="a.tasaExito < 50" [class.med]="a.tasaExito >= 50 && a.tasaExito < 80" [class.high]="a.tasaExito >= 80"></div>
                  </div>
                  <span class="percent">{{ a.tasaExito / 100 | percent:'1.0-0' }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="horas">
              <th mat-header-cell *matHeaderCellDef>Horas Trabajadas</th>
              <td mat-cell *matCellDef="let a">
                <span class="hours-val">{{ a.horasTrabajadas | number:'1.1-1' }}h</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns;"></tr>
          </table>

          <div *ngIf="!analistas.length" class="empty-msg">
            <p>No hay datos de analistas disponibles</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-card { margin-bottom: 24px; background: var(--bg-secondary); border: 1px solid var(--border-color); }
    .filter-form { display: flex; gap: 16px; align-items: center; padding: 8px 0; }
    .filter-actions { display: flex; gap: 8px; }

    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .chart-box { padding: 20px; h3 { margin-bottom: 16px; font-size: 1rem; color: var(--text-secondary); } }
    .chart-wrapper { height: 250px; position: relative; }

    .table-container { padding: 0; }
    .section-title { display: flex; align-items: center; gap: 8px; margin: 0; padding: 20px 24px; font-size: 1.1rem; mat-icon { color: var(--accent-cyan); } }
    .full-width { width: 100%; }

    .analista-cell { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-purple); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
    .info { display: flex; flex-direction: column; }
    .name { font-weight: 600; color: var(--text-primary); }
    .cargo { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }

    .text-center { text-align: center; }
    .count-badge { background: var(--bg-surface); padding: 4px 10px; border-radius: 6px; font-weight: 700; color: var(--accent-blue); border: 1px solid var(--border-color); }
    
    .time-metric { display: flex; align-items: center; gap: 4px; color: var(--accent-orange); mat-icon { font-size: 18px; width: 18px; height: 18px; } }

    .progress-wrapper { display: flex; align-items: center; gap: 10px; min-width: 140px; }
    .progress-bar { flex: 1; height: 6px; background: var(--bg-surface); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease-out; }
    .progress-fill.low { background: var(--accent-red); }
    .progress-fill.med { background: var(--accent-yellow); }
    .progress-fill.high { background: var(--accent-green); }
    .percent { font-size: 0.8rem; font-weight: 600; min-width: 35px; }

    .hours-val { font-weight: 600; color: var(--text-secondary); }

    .empty-msg { text-align: center; padding: 40px; color: var(--text-muted); }

    @media (max-width: 992px) { .charts-row { grid-template-columns: 1fr; } }
  `]
})
export class AnalistaDesempenoComponent implements OnInit {
  analistas: AnalistaDesempeno[] = [];
  loading = true;
  isAnalista = false;
  columns = ['nombre', 'resueltos', 'asignados', 'tiempoPromedio', 'tasaExito', 'horas'];

  filterForm = new FormGroup({
    inicio: new FormControl<Date | null>(null),
    fin: new FormControl<Date | null>(null)
  });

  // Chart Data
  resolvedChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  efficiencyChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      y: { grid: { color: '#2d3348' }, ticks: { color: '#9aa0b0' } },
      x: { grid: { display: false }, ticks: { color: '#9aa0b0' } }
    }
  };

  horizontalBarOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#9aa0b0' } } },
    scales: { 
      x: { grid: { color: '#2d3348' }, ticks: { color: '#9aa0b0' }, max: 100 },
      y: { grid: { display: false }, ticks: { color: '#9aa0b0' } }
    }
  };

  constructor(
    private reportesService: ReportesService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.isAnalista = this.authService.hasRole('ANALISTA') && !this.authService.hasRole('ADMIN', 'DIRECTOR');
    this.cargarDesempeno();
  }

  cargarDesempeno(): void {
    this.loading = true;
    const inicio = this.filterForm.value.inicio?.toISOString().split('T')[0];
    const fin = this.filterForm.value.fin?.toISOString().split('T')[0];

    this.reportesService.obtenerDesempenoPorAnalista(inicio, fin).subscribe({
      next: (data) => {
        this.analistas = data;
        this.buildCharts();
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar datos de desempeño');
        this.loading = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.cargarDesempeno();
  }

  buildCharts(): void {
    if (this.isAnalista) return;

    // Resolved Chart
    this.resolvedChartData = {
      labels: this.analistas.map(a => a.nombre),
      datasets: [{
        data: this.analistas.map(a => a.incidentesResueltos),
        label: 'Resueltos',
        backgroundColor: '#4f8cff',
        borderRadius: 4
      }]
    };

    // Efficiency Chart
    this.efficiencyChartData = {
      labels: this.analistas.map(a => a.nombre),
      datasets: [
        { data: this.analistas.map(a => a.tasaExito), label: 'Tasa Éxito (%)', backgroundColor: '#00c853', borderRadius: 4 },
        { data: this.analistas.map(a => (a.horasTrabajadas / 160) * 100), label: 'Utilización (%)', backgroundColor: '#7c5cfc', borderRadius: 4 }
      ]
    };
  }
}
