import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RecursoService } from '../../../core/services/recurso.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RecursoResponse } from '../../../core/models/recurso.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

// ============== FORM DIALOG ==============
@Component({
  selector: 'app-recurso-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>{{ data.recurso ? 'Editar' : 'Crear' }} Recurso</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="nombre"><mat-error>Requerido</mat-error></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Cargo</mat-label><input matInput formControlName="cargo"><mat-error>Requerido</mat-error></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Costo/Hora (USD)</mat-label><input matInput type="number" formControlName="costoPorHora"><mat-error>Mayor a 0</mat-error></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Especialidad</mat-label><input matInput formControlName="especialidad"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput formControlName="email"></mat-form-field>
        <mat-slide-toggle formControlName="activo" color="primary">Activo</mat-slide-toggle>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="ref.close(false)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        <mat-spinner *ngIf="saving" diameter="18"></mat-spinner>
        <span *ngIf="!saving">Guardar</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form { display:flex; flex-direction:column; gap:4px; min-width:400px; padding-top:8px; }`]
})
export class RecursoFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  constructor(public ref: MatDialogRef<RecursoFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {recurso?: RecursoResponse}, private fb: FormBuilder, private svc: RecursoService, private notify: NotificationService) {}
  ngOnInit() {
    const r = this.data.recurso;
    this.form = this.fb.group({
      nombre: [r?.nombre||'', Validators.required], cargo: [r?.cargo||'', Validators.required],
      costoPorHora: [r?.costoPorHora||null, [Validators.required, Validators.min(0.01)]],
      especialidad: [r?.especialidad||''], email: [r?.email||''], activo: [r?.activo ?? true]
    });
  }
  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const obs = this.data.recurso ? this.svc.update(this.data.recurso.id, this.form.value) : this.svc.create(this.form.value);
    obs.subscribe({ next: () => { this.notify.success('Recurso guardado'); this.ref.close(true); }, error: () => { this.saving=false; this.notify.error('Error'); }});
  }
}

// ============== LIST COMPONENT ==============
@Component({
  selector: 'app-recurso-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, CurrencyPipe],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Recursos Humanos</h1>
        <button mat-flat-button color="primary" (click)="openForm()" class="btn-new"><mat-icon>add</mat-icon> Nuevo Recurso</button>
      </div>
      <div class="card">
        <div *ngIf="loading" class="loading-shade"><mat-spinner diameter="40"></mat-spinner></div>
        <table mat-table [dataSource]="ds" matSort class="full-width">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th><td mat-cell *matCellDef="let r">#{{r.id}}</td></ng-container>
          <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th><td mat-cell *matCellDef="let r">{{r.nombre}}</td></ng-container>
          <ng-container matColumnDef="cargo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Cargo</th><td mat-cell *matCellDef="let r">{{r.cargo}}</td></ng-container>
          <ng-container matColumnDef="costoPorHora"><th mat-header-cell *matHeaderCellDef mat-sort-header>Costo/Hora</th><td mat-cell *matCellDef="let r">{{r.costoPorHora | currency:'USD'}}</td></ng-container>
          <ng-container matColumnDef="especialidad"><th mat-header-cell *matHeaderCellDef>Especialidad</th><td mat-cell *matCellDef="let r">{{r.especialidad || '—'}}</td></ng-container>
          <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let r"><button mat-icon-button matTooltip="Editar" (click)="openForm(r)"><mat-icon>edit</mat-icon></button><button mat-icon-button matTooltip="Eliminar" color="warn" (click)="del(r)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[10,25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.btn-new{border-radius:12px;font-weight:600;mat-icon{margin-right:4px}}.full-width{width:100%}.loading-shade{min-height:200px;display:flex;align-items:center;justify-content:center}`]
})
export class RecursoListComponent implements OnInit {
  cols = ['id','nombre','cargo','costoPorHora','especialidad','acciones'];
  ds = new MatTableDataSource<RecursoResponse>([]);
  loading = true;
  @ViewChild(MatPaginator) pag!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private svc: RecursoService, private notify: NotificationService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: d => { this.ds.data=d; setTimeout(()=>{this.ds.paginator=this.pag;this.ds.sort=this.sort;}); this.loading=false; },
      error: () => { this.notify.error('Error'); this.loading=false; }
    });
  }

  openForm(r?: RecursoResponse) {
    this.dialog.open(RecursoFormDialogComponent, { width:'520px', data:{recurso:r} })
      .afterClosed().subscribe(ok => { if(ok) this.load(); });
  }

  del(r: RecursoResponse) {
    this.dialog.open(ConfirmDialogComponent, { width:'420px', data:{title:'Eliminar Recurso', message:`¿Eliminar "${r.nombre}"?`} })
      .afterClosed().subscribe(ok => {
        if(ok) this.svc.delete(r.id).subscribe({ next:()=>{this.notify.success('Eliminado');this.load();}, error:()=>this.notify.error('Error') });
      });
  }
}
