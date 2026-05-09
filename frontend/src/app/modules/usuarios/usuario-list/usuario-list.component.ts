import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UsuarioService } from '../../../core/services/usuario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioResponse } from '../../../core/models/usuario.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsuarioFormDialogComponent } from './usuario-form-dialog.component';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatProgressSpinnerModule, MatTooltipModule, DatePipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Administración de Usuarios</h1>
        <button mat-flat-button color="primary" (click)="openForm()" class="btn-new">
          <mat-icon>person_add</mat-icon> Nuevo Usuario
        </button>
      </div>

      <div class="card">
        <div *ngIf="loading" class="loading-shade">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="full-width">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let u">#{{ u.id }}</td>
          </ng-container>

          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Usuario</th>
            <td mat-cell *matCellDef="let u">
              <div class="user-cell">
                <div class="avatar-sm">{{ u.nombreCompleto?.charAt(0) || 'U' }}</div>
                <span>{{ u.username }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="nombreCompleto">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
            <td mat-cell *matCellDef="let u">{{ u.nombreCompleto }}</td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let u">{{ u.email }}</td>
          </ng-container>

          <ng-container matColumnDef="rol">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="rolNombre">Rol</th>
            <td mat-cell *matCellDef="let u">
              <span class="chip chip-role">{{ u.rolNombre }}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="activo">
            <th mat-header-cell *matHeaderCellDef>Activo</th>
            <td mat-cell *matCellDef="let u">
              <mat-slide-toggle [checked]="u.activo" color="primary" disabled></mat-slide-toggle>
            </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let u">
              <button mat-icon-button matTooltip="Editar" (click)="openForm(u)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button matTooltip="Eliminar" color="warn" (click)="confirmDelete(u)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .btn-new { border-radius: 12px; font-weight: 600; mat-icon { margin-right: 4px; } }
    .full-width { width: 100%; }
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar-sm {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--gradient-purple); display: flex;
      align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.75rem; color: white;
    }
    .chip-role {
      background: rgba(124, 92, 252, 0.15);
      color: #7c5cfc;
    }
    .loading-shade { min-height: 200px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class UsuarioListComponent implements OnInit {
  columns = ['id', 'username', 'nombreCompleto', 'email', 'rol', 'activo', 'acciones'];
  dataSource = new MatTableDataSource<UsuarioResponse>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

  openForm(usuario?: UsuarioResponse): void {
    const dialogRef = this.dialog.open(UsuarioFormDialogComponent, {
      width: '520px',
      data: { usuario }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadData();
    });
  }

  confirmDelete(usuario: UsuarioResponse): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Eliminar el usuario "${usuario.username}"?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.delete(usuario.id).subscribe({
          next: () => { this.notification.success('Usuario eliminado'); this.loadData(); },
          error: () => this.notification.error('Error al eliminar usuario')
        });
      }
    });
  }
}
