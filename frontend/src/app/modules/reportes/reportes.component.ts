import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

// Charts
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

// Services & Models
import { ReportesService } from '../../core/services/reportes.service';
import { IncidenteService } from '../../core/services/incidente.service';
import { EstadoService } from '../../core/services/estado.service';
import { NotificationService } from '../../core/services/notification.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { IncidenteResponse } from '../../core/models/incidente.model';
import { DashboardResponse } from '../../core/models/dashboard.model';
import { CostoMensual, MttrMensual, IncidentePorCategoria } from '../../core/models/reportes.model';
import { EstadoResponse } from '../../core/models/estado.model';

// jsPDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatTableModule,
    MatProgressSpinnerModule, MatDividerModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatTooltipModule, BaseChartDirective,
    CurrencyPipe, DatePipe, DecimalPipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Reportes Avanzados e Indicadores</h1>
        <div class="header-actions">
          <button mat-flat-button color="primary" (click)="exportPDF()" [disabled]="loading || !incidentes.length">
            <mat-icon>picture_as_pdf</mat-icon> Exportar PDF
          </button>
          <button mat-stroked-button (click)="exportCSV()" [disabled]="loading || !incidentes.length">
            <mat-icon>download</mat-icon> CSV
          </button>
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

            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="estado">
                <mat-option [value]="null">Todos los estados</mat-option>
                <mat-option *ngFor="let st of estados" [value]="st.nombre">{{ st.nombre }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Cliente</mat-label>
              <input matInput formControlName="cliente" placeholder="Buscar por cliente...">
            </mat-form-field>

            <div class="filter-actions">
              <button mat-flat-button color="accent" (click)="aplicarFiltros()">
                <mat-icon>filter_list</mat-icon> Filtrar
              </button>
              <button mat-button (click)="limpiarFiltros()">
                Limpiar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <div *ngIf="loading" class="loading-shade">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div *ngIf="!loading">
        <!-- KPIs -->
        <div class="summary-grid" *ngIf="dashboard">
          <div class="summary-card">
            <div class="card-icon blue"><mat-icon>assessment</mat-icon></div>
            <div class="summary-info">
              <span class="summary-value">{{ filteredIncidentes.length }}</span>
              <span class="summary-label">Incidentes Filtrados</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon cyan"><mat-icon>account_balance_wallet</mat-icon></div>
            <div class="summary-info">
              <span class="summary-value">{{ totalCostoEstimado | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="summary-label">Costo Estimado</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon orange"><mat-icon>payments</mat-icon></div>
            <div class="summary-info">
              <span class="summary-value">{{ totalCostoReal | currency:'USD':'symbol':'1.0-0' }}</span>
              <span class="summary-label">Costo Real</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon green"><mat-icon>show_chart</mat-icon></div>
            <div class="summary-info">
              <span class="summary-value" [class.text-positive]="totalMargen >= 0" [class.text-negative]="totalMargen < 0">
                {{ totalMargen | currency:'USD':'symbol':'1.0-0' }}
              </span>
              <span class="summary-label">Margen Operativo</span>
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="charts-row">
          <div class="card chart-box">
            <h3>Evolución de MTTR (Horas)</h3>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="mttrChartData"
                [options]="lineChartOptions"
                [type]="'line'">
              </canvas>
            </div>
          </div>
          <div class="card chart-box">
            <h3>Costos Mensuales: Estimado vs Real</h3>
            <div class="chart-wrapper">
              <canvas baseChart
                [data]="costosChartData"
                [options]="barChartOptions"
                [type]="'bar'">
              </canvas>
            </div>
          </div>
        </div>

        <div class="charts-row">
          <div class="card chart-box">
            <h3>Incidentes por Categoría (Prioridad)</h3>
            <div class="chart-wrapper doughnut">
              <canvas baseChart
                [data]="catChartData"
                [options]="doughnutOptions"
                [type]="'doughnut'">
              </canvas>
            </div>
          </div>
          <div class="card info-box">
            <h3>Resumen de Tiempos de Respuesta</h3>
            <div class="time-stats" *ngIf="tiempoRespuesta">
              <div class="stat-item">
                <span class="stat-val">{{ tiempoRespuesta.promedioGlobalMinutos | number:'1.0-0' }} min</span>
                <span class="stat-lab">Promedio Global (Primer Cambio)</span>
              </div>
              <div class="stat-item">
                <span class="stat-val">{{ tiempoRespuesta.totalIncidentesAnalizados }}</span>
                <span class="stat-lab">Incidentes Analizados</span>
              </div>
              <mat-divider></mat-divider>
              <div class="stat-list">
                <div *ngFor="let d of tiempoRespuesta.detalles.slice(0, 5)" class="list-item">
                  <span class="item-name">{{ d.titulo }}</span>
                  <span class="item-val">{{ d.tiempoRespuestaMinutos }}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla Financiera -->
        <div class="card table-container">
          <h3 class="section-title">
            <mat-icon>receipt_long</mat-icon> Detalle Financiero de Incidentes
          </h3>
          <mat-divider></mat-divider>

          <table mat-table [dataSource]="filteredIncidentes" class="full-width">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let i">#{{ i.id }}</td>
            </ng-container>
            <ng-container matColumnDef="titulo">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let i" class="cell-title" [matTooltip]="i.titulo">{{ i.titulo }}</td>
            </ng-container>
            <ng-container matColumnDef="cliente">
              <th mat-header-cell *matHeaderCellDef>Cliente</th>
              <td mat-cell *matCellDef="let i">{{ i.cliente }}</td>
            </ng-container>
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let i">
                 <span class="chip" [style.backgroundColor]="i.estadoColor + '33'" [style.color]="i.estadoColor">
                   {{ i.estadoNombre }}
                 </span>
              </td>
            </ng-container>
            <ng-container matColumnDef="costoEstimado">
              <th mat-header-cell *matHeaderCellDef>Estimado</th>
              <td mat-cell *matCellDef="let i">{{ i.costoEstimado | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>
            <ng-container matColumnDef="costoReal">
              <th mat-header-cell *matHeaderCellDef>Real</th>
              <td mat-cell *matCellDef="let i">{{ i.costoReal | currency:'USD':'symbol':'1.0-0' }}</td>
            </ng-container>
            <ng-container matColumnDef="margen">
              <th mat-header-cell *matHeaderCellDef>Margen</th>
              <td mat-cell *matCellDef="let i"
                  [class.text-positive]="i.margenAbsoluto >= 0"
                  [class.text-negative]="i.margenAbsoluto < 0">
                {{ i.margenAbsoluto | currency:'USD':'symbol':'1.0-0' }}
              </td>
            </ng-container>
            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let i">{{ i.fechaCreacion | date:'dd/MM/yyyy' }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="reportColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: reportColumns;"></tr>
          </table>

          <div *ngIf="!filteredIncidentes.length" class="empty-msg">
            <mat-icon>search_off</mat-icon>
            <p>No se encontraron incidentes con los filtros seleccionados</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-card { margin-bottom: 24px; border: 1px solid var(--border-color); background: var(--bg-secondary); }
    .filter-form { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; padding: 8px 0; }
    .filter-form mat-form-field { flex: 1; min-width: 200px; }
    .filter-actions { display: flex; gap: 8px; align-items: center; }

    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .summary-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 20px; display: flex; align-items: center; gap: 16px; }
    .card-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .card-icon mat-icon { color: white; }
    .card-icon.blue { background: var(--gradient-blue); }
    .card-icon.cyan { background: var(--gradient-cyan); }
    .card-icon.orange { background: var(--gradient-orange); }
    .card-icon.green { background: var(--gradient-green); }
    .summary-info { display: flex; flex-direction: column; }
    .summary-value { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); }
    .summary-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .chart-box { padding: 20px; h3 { margin-bottom: 16px; font-size: 1rem; color: var(--text-secondary); } }
    .chart-wrapper { height: 250px; position: relative; }
    .chart-wrapper.doughnut { height: 220px; }

    .info-box { padding: 20px; }
    .time-stats { display: flex; flex-direction: column; gap: 16px; }
    .stat-item { display: flex; flex-direction: column; }
    .stat-val { font-size: 1.5rem; font-weight: 700; color: var(--accent-cyan); }
    .stat-lab { font-size: 0.75rem; color: var(--text-muted); }
    .stat-list { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
    .list-item { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); }
    .item-name { max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .item-val { font-weight: 600; color: var(--text-primary); }

    .table-container { padding: 0; overflow: hidden; }
    .section-title { display: flex; align-items: center; gap: 8px; margin: 0; padding: 20px 24px; font-size: 1.1rem; color: var(--text-primary); mat-icon { color: var(--accent-cyan); } }
    .full-width { width: 100%; }
    .cell-title { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .chip { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
    .empty-msg { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: var(--text-muted); mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; } }

    @media (max-width: 992px) { .charts-row { grid-template-columns: 1fr; } }
  `]
})
export class ReportesComponent implements OnInit {
  incidentes: IncidenteResponse[] = [];
  filteredIncidentes: IncidenteResponse[] = [];
  estados: EstadoResponse[] = [];
  dashboard: DashboardResponse | null = null;
  tiempoRespuesta: any = null;

  loading = true;
  reportColumns = ['id', 'fecha', 'titulo', 'cliente', 'estado', 'costoEstimado', 'costoReal', 'margen'];

  filterForm = new FormGroup({
    inicio: new FormControl<Date | null>(null),
    fin: new FormControl<Date | null>(null),
    estado: new FormControl<string | null>(null),
    cliente: new FormControl<string | null>(null)
  });

  // KPI Totals
  totalCostoEstimado = 0;
  totalCostoReal = 0;
  totalMargen = 0;

  // Chart Data
  mttrChartData: ChartData<'line'> = { labels: [], datasets: [] };
  costosChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  catChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  // Chart Options
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      y: { grid: { color: '#2d3348' }, ticks: { color: '#9aa0b0' } },
      x: { grid: { display: false }, ticks: { color: '#9aa0b0' } }
    }
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#9aa0b0' } } },
    scales: { 
      y: { grid: { color: '#2d3348' }, ticks: { color: '#9aa0b0' } },
      x: { grid: { display: false }, ticks: { color: '#9aa0b0' } }
    }
  };

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true, maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { position: 'right', labels: { color: '#9aa0b0', padding: 20, usePointStyle: true } } }
  };

  constructor(
    private reportesService: ReportesService,
    private incidenteService: IncidenteService,
    private estadoService: EstadoService,
    private dashboardService: DashboardService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarDatosBase();
  }

  cargarDatosBase(): void {
    this.loading = true;
    this.estadoService.getAll().subscribe(estados => this.estados = estados);
    
    this.incidenteService.getAll().subscribe({
      next: (data) => {
        this.incidentes = data;
        this.filteredIncidentes = [...data];
        this.actualizarMetricas();
        this.cargarReportesAvanzados();
      },
      error: () => {
        this.notification.error('Error al cargar incidentes');
        this.loading = false;
      }
    });
  }

  cargarReportesAvanzados(): void {
    const start = this.filterForm.value.inicio?.toISOString().split('T')[0];
    const end = this.filterForm.value.fin?.toISOString().split('T')[0];

    // MTTR Historico
    this.reportesService.obtenerMttrHistorico(start, end).subscribe(data => {
      this.mttrChartData = {
        labels: data.map(d => d.mesNombre + ' ' + d.anio),
        datasets: [{
          data: data.map(d => d.mttrHoras),
          label: 'MTTR (Horas)',
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    });

    // Costos Mensuales
    this.reportesService.obtenerCostosMensuales(start, end).subscribe(data => {
      this.costosChartData = {
        labels: data.map(d => d.mesNombre),
        datasets: [
          { data: data.map(d => d.costoEstimado), label: 'Estimado', backgroundColor: '#4f8cff', borderRadius: 4 },
          { data: data.map(d => d.costoReal), label: 'Real', backgroundColor: '#ff9100', borderRadius: 4 }
        ]
      };
    });

    // Categorias
    this.reportesService.obtenerIncidentesPorCategoria('prioridad').subscribe(data => {
      this.catChartData = {
        labels: data.map(d => d.categoria),
        datasets: [{
          data: data.map(d => d.cantidad),
          backgroundColor: ['#ff3d57', '#ff9100', '#4f8cff', '#00c853']
        }]
      };
    });

    // Tiempos Respuesta
    this.reportesService.obtenerTiemposRespuesta().subscribe(data => this.tiempoRespuesta = data);

    // Resumen General
    this.dashboardService.getResumen().subscribe(data => {
      this.dashboard = data;
      this.loading = false;
    });
  }

  aplicarFiltros(): void {
    const { inicio, fin, estado, cliente } = this.filterForm.value;

    this.filteredIncidentes = this.incidentes.filter(i => {
      const fecha = new Date(i.fechaCreacion);
      const matchesFecha = (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
      const matchesEstado = !estado || i.estadoNombre === estado;
      const matchesCliente = !cliente || i.cliente?.toLowerCase().includes(cliente.toLowerCase());
      
      return matchesFecha && matchesEstado && matchesCliente;
    });

    this.actualizarMetricas();
    this.cargarReportesAvanzados(); // Recargar gráficos con fechas
    this.notification.success('Filtros aplicados');
  }

  limpiarFiltros(): void {
    this.filterForm.reset();
    this.filteredIncidentes = [...this.incidentes];
    this.actualizarMetricas();
    this.cargarReportesAvanzados();
  }

  actualizarMetricas(): void {
    this.totalCostoEstimado = this.filteredIncidentes.reduce((acc, i) => acc + (i.costoEstimado || 0), 0);
    this.totalCostoReal = this.filteredIncidentes.reduce((acc, i) => acc + (i.costoReal || 0), 0);
    this.totalMargen = this.filteredIncidentes.reduce((acc, i) => acc + (i.margenAbsoluto || 0), 0);
  }

  exportCSV(): void {
    const headers = ['ID', 'Fecha', 'Título', 'Cliente', 'Estado', 'Costo Estimado', 'Costo Real', 'Margen'];
    const rows = this.filteredIncidentes.map(i => [
      i.id, new Date(i.fechaCreacion).toLocaleDateString(), `"${i.titulo}"`, `"${i.cliente}"`, i.estadoNombre,
      i.costoEstimado, i.costoReal, i.margenAbsoluto
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_financiero_${new Date().getTime()}.csv`;
    link.click();
  }

  exportPDF(): void {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleString();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text('Reporte Financiero de Incidentes', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${dateStr}`, 14, 30);
    
    // Filtros aplicados
    const { inicio, fin, estado, cliente } = this.filterForm.value;
    let filterText = 'Filtros: ';
    if (inicio && fin) filterText += `Período: ${inicio.toLocaleDateString()} - ${fin.toLocaleDateString()} | `;
    if (estado) filterText += `Estado: ${estado} | `;
    if (cliente) filterText += `Cliente: ${cliente}`;
    if (!inicio && !estado && !cliente) filterText += 'Ninguno';
    doc.text(filterText, 14, 36);

    // KPIs en texto
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumen Ejecutivo:', 14, 48);
    doc.setFontSize(10);
    doc.text(`- Incidentes totales: ${this.filteredIncidentes.length}`, 20, 56);
    doc.text(`- Costo Estimado Total: $${this.totalCostoEstimado.toLocaleString()}`, 20, 62);
    doc.text(`- Costo Real Total: $${this.totalCostoReal.toLocaleString()}`, 20, 68);
    doc.text(`- Margen Operativo Total: $${this.totalMargen.toLocaleString()}`, 20, 74);

    // Tabla
    autoTable(doc, {
      startY: 85,
      head: [['ID', 'Fecha', 'Título', 'Cliente', 'Estado', 'Estimado', 'Real', 'Margen']],
      body: this.filteredIncidentes.map(i => [
        i.id,
        new Date(i.fechaCreacion).toLocaleDateString(),
        i.titulo.substring(0, 30) + (i.titulo.length > 30 ? '...' : ''),
        i.cliente || 'N/A',
        i.estadoNombre,
        `$${i.costoEstimado.toLocaleString()}`,
        `$${i.costoReal.toLocaleString()}`,
        `$${i.margenAbsoluto.toLocaleString()}`
      ]),
      headStyles: { fillColor: [45, 51, 72] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`Reporte_CyberShield_${new Date().getTime()}.pdf`);
    this.notification.success('Reporte PDF generado con éxito');
  }
}
