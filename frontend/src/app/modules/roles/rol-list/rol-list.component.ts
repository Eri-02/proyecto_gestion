import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { RolService } from '../../../core/services/rol.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RolResponse } from '../../../core/models/rol.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RolFormDialogComponent } from './rol-form-dialog.component';

@Component({
  selector: 'app-rol-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatTooltipModule, MatChipsModule, DatePipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestión de Roles</h1>
        <button mat-flat-button color="primary" (click)="openForm()" class="btn-new">
          <mat-icon>add</mat-icon> Nuevo Rol
        </button>
      </div>

      <div class="card">
        <div *ngIf="loading" class="loading-shade">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="full-width">

          <!-- ID -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let r">#{{ r.id }}</td>
          </ng-container>

          <!-- Nombre -->
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
            <td mat-cell *matCellDef="let r">
              <div class="rol-cell">
                <mat-icon class="rol-icon">shield</mat-icon>
                <span class="rol-nombre">{{ r.nombre }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Descripción -->
          <ng-container matColumnDef="descripcion">
            <th mat-header-cell *matHeaderCellDef>Descripción</th>
            <td mat-cell *matCellDef="let r" class="text-secondary">
              {{ r.descripcion || '—' }}
            </td>
          </ng-container>

          <!-- Nivel de Permiso -->
          <ng-container matColumnDef="nivelPermiso">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nivel</th>
            <td mat-cell *matCellDef="let r">
              <span class="chip" [ngClass]="nivelClass(r.nivelPermiso)">
                {{ nivelLabel(r.nivelPermiso) }}
              </span>
            </td>
          </ng-container>

          <!-- Fecha creación -->
          <ng-container matColumnDef="fechaCreacion">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Creado</th>
            <td mat-cell *matCellDef="let r" class="text-secondary">
              {{ r.fechaCreacion | date:'dd/MM/yyyy' }}
            </td>
          </ng-container>

          <!-- Acciones -->
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let r">
              <button mat-icon-button matTooltip="Editar" (click)="openForm(r)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Eliminar" color="warn" (click)="confirmDelete(r)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>

          <!-- Sin resultados -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="columns.length">
              <mat-icon>info_outline</mat-icon>
              <span>No hay roles registrados</span>
            </td>
          </tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .btn-new {
      border-radius: 12px;
      font-weight: 600;
      mat-icon { margin-right: 4px; }
    }
    .full-width { width: 100%; }

    .rol-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .rol-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--accent-purple);
    }
    .rol-nombre {
      font-family: monospace;
      font-size: 0.85rem;
      color: var(--text-primary);
    }

    .text-secondary {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    /* Chips de nivel */
    .chip-nivel-1 { background: rgba(107, 113, 133, 0.2); color: var(--text-secondary); }
    .chip-nivel-2 { background: rgba(79, 140, 255, 0.15); color: var(--accent-blue); }
    .chip-nivel-3 { background: rgba(124, 92, 252, 0.15); color: var(--accent-purple); }
    .chip-nivel-4 { background: rgba(255, 61, 87, 0.15); color: var(--accent-red); }

    .loading-shade {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-data {
      text-align: center;
      padding: 48px 0;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
    }
  `]
})
export class RolListComponent implements OnInit {
  columns = ['id', 'nombre', 'descripcion', 'nivelPermiso', 'fechaCreacion', 'acciones'];
  dataSource = new MatTableDataSource<RolResponse>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private rolService: RolService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar los roles');
        this.loading = false;
      }
    });
  }

  openForm(rol?: RolResponse): void {
    const dialogRef = this.dialog.open(RolFormDialogComponent, {
      width: '520px',
      data: { rol }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  confirmDelete(rol: RolResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar Rol',
        message: `¿Eliminar el rol "${rol.nombre}"? Asegúrate de que no haya usuarios asignados a este rol.`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolService.delete(rol.id).subscribe({
          next: () => { this.notification.success('Rol eliminado'); this.loadData(); },
          error: (err) => this.notification.error(err.error?.message || 'Error al eliminar el rol')
        });
      }
    });
  }

  nivelLabel(nivel: number): string {
    const labels: Record<number, string> = {
      1: 'Nivel 1 — Lectura',
      2: 'Nivel 2 — Operativo',
      3: 'Nivel 3 — Gestión',
      4: 'Nivel 4 — Total'
    };
    return labels[nivel] ?? `Nivel ${nivel}`;
  }

  nivelClass(nivel: number): string {
    return `chip chip-nivel-${nivel}`;
  }
}
