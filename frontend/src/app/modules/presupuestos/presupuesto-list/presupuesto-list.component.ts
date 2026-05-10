import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PresupuestoService } from '../../../core/services/presupuesto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PresupuestoEstado, PresupuestoResponse } from '../../../core/models/presupuesto.model';

@Component({
  selector: 'app-presupuesto-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatTooltipModule,
    CurrencyPipe, DatePipe, DecimalPipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Presupuestos</h1>
        <button mat-flat-button color="primary" class="btn-new" (click)="router.navigate(['/presupuestos/nuevo'])">
          <mat-icon>add</mat-icon> Nuevo Presupuesto
        </button>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon blue"><mat-icon>account_balance_wallet</mat-icon></div>
          <div>
            <span class="summary-value">{{ totalPresupuestado | currency:'USD':'symbol':'1.0-0' }}</span>
            <span class="summary-label">Presupuestado</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon orange"><mat-icon>payments</mat-icon></div>
          <div>
            <span class="summary-value">{{ totalConsumido | currency:'USD':'symbol':'1.0-0' }}</span>
            <span class="summary-label">Consumido</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon green"><mat-icon>savings</mat-icon></div>
          <div>
            <span class="summary-value">{{ totalDisponible | currency:'USD':'symbol':'1.0-0' }}</span>
            <span class="summary-label">Disponible</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon red"><mat-icon>warning</mat-icon></div>
          <div>
            <span class="summary-value">{{ presupuestosEnAlerta }}</span>
            <span class="summary-label">En alerta</span>
          </div>
        </div>
      </div>

      <div class="card filters-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [(ngModel)]="search" (ngModelChange)="applyFilters()" placeholder="Nombre, descripción o responsable">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [(value)]="filterEstado" (selectionChange)="applyFilters()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="VIGENTE">Vigente</mat-option>
            <mat-option value="ALERTA">Alerta</mat-option>
            <mat-option value="EXCEDIDO">Excedido</mat-option>
            <mat-option value="CERRADO">Cerrado</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="card table-card">
        <div *ngIf="loading" class="loading-shade">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="full-width">
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Presupuesto</th>
            <td mat-cell *matCellDef="let p">
              <div class="budget-name">
                <strong>{{ p.nombre }}</strong>
                <span>{{ p.creadoPorUsuarioNombre || 'Sin responsable' }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="periodo">
            <th mat-header-cell *matHeaderCellDef>Periodo</th>
            <td mat-cell *matCellDef="let p">{{ p.fechaInicio | date:'dd/MM/yyyy' }} - {{ p.fechaFin | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="presupuesto">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="montoPresupuestado">Presupuesto</th>
            <td mat-cell *matCellDef="let p">{{ p.montoPresupuestado | currency:'USD':'symbol':'1.0-0' }}</td>
          </ng-container>

          <ng-container matColumnDef="consumido">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="montoConsumido">Consumido</th>
            <td mat-cell *matCellDef="let p">{{ p.montoConsumido | currency:'USD':'symbol':'1.0-0' }}</td>
          </ng-container>

          <ng-container matColumnDef="consumo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="porcentajeConsumo">Consumo</th>
            <td mat-cell *matCellDef="let p" class="progress-cell">
              <div class="progress-header">
                <span>{{ p.porcentajeConsumo | number:'1.0-1' }}%</span>
                <span [ngClass]="getConsumoTextClass(p)">{{ p.montoDisponible | currency:'USD':'symbol':'1.0-0' }}</span>
              </div>
              <mat-progress-bar [value]="getProgressValue(p)" [color]="getProgressColor(p)"></mat-progress-bar>
            </td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Estado</th>
            <td mat-cell *matCellDef="let p"><span class="chip" [ngClass]="getEstadoClass(p.estado)">{{ formatEstado(p.estado) }}</span></td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let p">
              <button mat-icon-button matTooltip="Editar" (click)="router.navigate(['/presupuestos', p.id, 'editar'])">
                <mat-icon>edit</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <div *ngIf="!loading && !filteredData.length" class="empty-msg">
          <mat-icon>account_balance_wallet</mat-icon>
          <p>No hay presupuestos para los filtros seleccionados</p>
        </div>

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .btn-new { height: 44px; border-radius: 12px; font-weight: 600; }
    .btn-new mat-icon { margin-right: 4px; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .summary-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
    .summary-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .summary-icon mat-icon { color: white; }
    .summary-icon.blue { background: var(--gradient-blue); }
    .summary-icon.orange { background: var(--gradient-orange); }
    .summary-icon.green { background: var(--gradient-green); }
    .summary-icon.red { background: var(--gradient-red); }
    .summary-value { display: block; font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
    .summary-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .filters-bar { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; padding: 16px 20px; }
    .filters-bar mat-form-field { flex: 1; min-width: 190px; }
    .search-field { flex: 2 !important; min-width: 260px !important; }
    .table-card { position: relative; padding: 0; overflow: hidden; }
    .full-width { width: 100%; }
    .budget-name { display: flex; flex-direction: column; gap: 3px; max-width: 260px; }
    .budget-name strong { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .budget-name span { color: var(--text-muted); font-size: 0.78rem; }
    .progress-cell { min-width: 220px; }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.8rem; color: var(--text-secondary); }
    table th, table td { padding: 12px 16px !important; }
    .empty-msg { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px; color: var(--text-muted); }
    .empty-msg mat-icon { font-size: 44px; width: 44px; height: 44px; margin-bottom: 12px; }
    @media (max-width: 960px) { .filters-bar { flex-direction: column; } }
  `]
})
export class PresupuestoListComponent implements OnInit {
  columns = ['nombre', 'periodo', 'presupuesto', 'consumido', 'consumo', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<PresupuestoResponse>([]);
  allData: PresupuestoResponse[] = [];
  filteredData: PresupuestoResponse[] = [];
  loading = true;
  search = '';
  filterEstado = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public router: Router,
    private presupuestoService: PresupuestoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.presupuestoService.getAll().subscribe({
      next: (presupuestos) => {
        this.allData = presupuestos || [];
        this.applyFilters();
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar presupuestos');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const search = this.search.toLowerCase().trim();
    this.filteredData = this.allData.filter(p => {
      const matchesEstado = !this.filterEstado || p.estado === this.filterEstado;
      const matchesSearch = !search ||
        `${p.nombre} ${p.descripcion} ${p.creadoPorUsuarioNombre}`.toLowerCase().includes(search);
      return matchesEstado && matchesSearch;
    });
    this.dataSource.data = this.filteredData;
  }

  get totalPresupuestado(): number {
    return this.filteredData.reduce((acc, p) => acc + (p.montoPresupuestado || 0), 0);
  }

  get totalConsumido(): number {
    return this.filteredData.reduce((acc, p) => acc + (p.montoConsumido || 0), 0);
  }

  get totalDisponible(): number {
    return this.filteredData.reduce((acc, p) => acc + (p.montoDisponible || 0), 0);
  }

  get presupuestosEnAlerta(): number {
    return this.filteredData.filter(p => p.estado === 'ALERTA' || p.estado === 'EXCEDIDO').length;
  }

  getProgressValue(p: PresupuestoResponse): number {
    return Math.min(p.porcentajeConsumo || 0, 100);
  }

  getProgressColor(p: PresupuestoResponse): 'primary' | 'accent' | 'warn' {
    if (p.estado === 'EXCEDIDO') return 'warn';
    if (p.estado === 'ALERTA') return 'accent';
    return 'primary';
  }

  getConsumoTextClass(p: PresupuestoResponse): string {
    if (p.estado === 'EXCEDIDO') return 'text-negative';
    if (p.estado === 'ALERTA') return 'text-warning';
    return 'text-positive';
  }

  getEstadoClass(estado: string): string {
    const map: Record<string, string> = {
      VIGENTE: 'chip-resuelto',
      ALERTA: 'chip-alta',
      EXCEDIDO: 'chip-critica',
      CERRADO: 'chip-cerrado'
    };
    return map[estado] || 'chip-media';
  }

  formatEstado(estado: string): string {
    const map: Record<string, string> = {
      VIGENTE: 'Vigente',
      ALERTA: 'Alerta',
      EXCEDIDO: 'Excedido',
      CERRADO: 'Cerrado'
    };
    return map[estado] || estado;
  }
}
