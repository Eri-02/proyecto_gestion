import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { IncidenteService } from '../../../core/services/incidente.service';
import { NotificationService } from '../../../core/services/notification.service';
import { IncidenteResponse } from '../../../core/models/incidente.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-incidente-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule, CurrencyPipe, DatePipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Incidentes</h1>
        <button mat-flat-button color="primary" (click)="router.navigate(['/incidentes/nuevo'])" class="btn-new">
          <mat-icon>add</mat-icon> Nuevo Incidente
        </button>
      </div>

      <!-- Filters -->
      <div class="card filters-bar">
        <mat-form-field appearance="outline" class="filter-field search-field">
          <mat-label>Buscar</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput (input)="onSearch($event)" placeholder="Buscar por título...">
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Prioridad</mat-label>
          <mat-select [(value)]="filterPrioridad" (selectionChange)="applyFilters()">
            <mat-option value="">Todas</mat-option>
            <mat-option value="Baja">Baja</mat-option>
            <mat-option value="Media">Media</mat-option>
            <mat-option value="Alta">Alta</mat-option>
            <mat-option value="Crítica">Crítica</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Estado</mat-label>
          <mat-select [(value)]="filterEstado" (selectionChange)="applyFilters()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="Nuevo">Nuevo</mat-option>
            <mat-option value="EnAnálisis">En Análisis</mat-option>
            <mat-option value="Resuelto">Resuelto</mat-option>
            <mat-option value="Cerrado">Cerrado</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Table -->
      <div class="card table-card">
        <div *ngIf="loading" class="loading-shade">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="full-width">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let e">#{{ e.id }}</td>
          </ng-container>

          <ng-container matColumnDef="titulo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Título</th>
            <td mat-cell *matCellDef="let e" class="cell-title">{{ e.titulo }}</td>
          </ng-container>

          <ng-container matColumnDef="prioridad">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="prioridadNombre">Prioridad</th>
            <td mat-cell *matCellDef="let e">
              <span class="chip" [ngClass]="getPrioridadClass(e.prioridadNombre)">
                {{ e.prioridadNombre }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="estadoNombre">Estado</th>
            <td mat-cell *matCellDef="let e">
              <span class="chip" [ngClass]="getEstadoClass(e.estadoNombre)">
                {{ e.estadoNombre }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="costoEstimado">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Estimado</th>
            <td mat-cell *matCellDef="let e">{{ e.costoEstimado | currency:'USD':'symbol':'1.0-0' }}</td>
          </ng-container>

          <ng-container matColumnDef="costoReal">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Real</th>
            <td mat-cell *matCellDef="let e">{{ e.costoReal | currency:'USD':'symbol':'1.0-0' }}</td>
          </ng-container>

          <ng-container matColumnDef="desviacion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="desviacionPorcentual">Desviación</th>
            <td mat-cell *matCellDef="let e"
                [class.text-negative]="e.desviacionPorcentual > 15"
                [class.text-warning]="e.desviacionPorcentual > 0 && e.desviacionPorcentual <= 15"
                [class.text-positive]="e.desviacionPorcentual <= 0">
              {{ e.desviacionPorcentual | number:'1.1-1' }}%
            </td>
          </ng-container>

          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="fechaCreacion">Fecha</th>
            <td mat-cell *matCellDef="let e">{{ e.fechaCreacion | date:'dd/MM/yyyy' }}</td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let e">
              <button mat-icon-button matTooltip="Ver detalle" (click)="router.navigate(['/incidentes', e.id]); $event.stopPropagation()">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Editar" (click)="router.navigate(['/incidentes', e.id, 'editar']); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Eliminar" color="warn" (click)="confirmDelete(e); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              (click)="router.navigate(['/incidentes', row.id])"
              class="clickable-row"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .btn-new {
      height: 44px;
      border-radius: 12px;
      font-weight: 600;
      mat-icon { margin-right: 4px; }
    }

    .filters-bar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      align-items: flex-start;
      margin-bottom: 20px;
      padding: 16px 20px;
    }

    .filter-field {
      min-width: 180px;
      flex: 1;
    }

    .search-field {
      flex: 2;
      min-width: 260px;
    }

    .table-card {
      position: relative;
      padding: 0;
      overflow: hidden;
    }

    .full-width { width: 100%; }

    .cell-title {
      max-width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
    }

    .clickable-row {
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    table {
      th, td { padding: 12px 16px !important; }
    }

    @media (max-width: 960px) {
      .filters-bar {
        flex-direction: column;
      }
    }
  `]
})
export class IncidenteListComponent implements OnInit {
  displayedColumns = ['id', 'titulo', 'prioridad', 'estado', 'costoEstimado', 'costoReal', 'desviacion', 'fecha', 'acciones'];
  dataSource = new MatTableDataSource<IncidenteResponse>([]);
  allData: IncidenteResponse[] = [];
  loading = true;

  filterPrioridad = '';
  filterEstado = '';
  private searchSubject = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public router: Router,
    private incidenteService: IncidenteService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value => {
      this.dataSource.filter = value.trim().toLowerCase();
    });
  }

  loadData(): void {
    this.loading = true;
    this.incidenteService.getAll().subscribe({
      next: (data) => {
        this.allData = data;
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar incidentes');
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  applyFilters(): void {
    let filtered = [...this.allData];
    if (this.filterPrioridad) {
      filtered = filtered.filter(i => i.prioridadNombre === this.filterPrioridad);
    }
    if (this.filterEstado) {
      filtered = filtered.filter(i => i.estadoNombre === this.filterEstado);
    }
    this.dataSource.data = filtered;
  }

  confirmDelete(incidente: IncidenteResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar Incidente',
        message: `¿Está seguro de eliminar el incidente "${incidente.titulo}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.incidenteService.delete(incidente.id).subscribe({
          next: () => {
            this.notification.success('Incidente eliminado correctamente');
            this.loadData();
          },
          error: () => this.notification.error('Error al eliminar incidente')
        });
      }
    });
  }

  getPrioridadClass(nombre: string): string {
    const map: Record<string, string> = {
      'Baja': 'chip-baja', 'Media': 'chip-media',
      'Alta': 'chip-alta', 'Crítica': 'chip-critica'
    };
    return map[nombre] || 'chip-media';
  }

  getEstadoClass(nombre: string): string {
    const map: Record<string, string> = {
      'Nuevo': 'chip-nuevo', 'EnAnálisis': 'chip-enanalisis',
      'Resuelto': 'chip-resuelto', 'Cerrado': 'chip-cerrado'
    };
    return map[nombre] || 'chip-nuevo';
  }
}
