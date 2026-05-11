import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RolService } from '../../../core/services/rol.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RolResponse } from '../../../core/models/rol.model';

@Component({
  selector: 'app-rol-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Crear' }} Rol</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">

        <mat-form-field appearance="outline">
          <mat-label>Nombre del Rol</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: ROLE_ANALISTA">
          <mat-hint>Usar formato ROLE_NOMBRE en mayúsculas</mat-hint>
          <mat-error>El nombre del rol es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3"
            placeholder="Describe las responsabilidades de este rol"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nivel de Permiso</mat-label>
          <mat-select formControlName="nivelPermiso">
            <mat-option [value]="1">Nivel 1 — Solo lectura</mat-option>
            <mat-option [value]="2">Nivel 2 — Operativo (Analista / Finanzas)</mat-option>
            <mat-option [value]="3">Nivel 3 — Gestión (Admin / Director)</mat-option>
            <mat-option [value]="4">Nivel 4 — Acceso total (Super Admin)</mat-option>
          </mat-select>
          <mat-error>Seleccione un nivel de permiso</mat-error>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        <mat-spinner *ngIf="saving" diameter="18"></mat-spinner>
        <span *ngIf="!saving">{{ isEdit ? 'Actualizar' : 'Crear' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 420px;
      padding-top: 8px;
    }
    @media (max-width: 500px) { .dialog-form { min-width: unset; } }
  `]
})
export class RolFormDialogComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<RolFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rol?: RolResponse },
    private fb: FormBuilder,
    private rolService: RolService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.rol;

    this.form = this.fb.group({
      nombre: [this.data?.rol?.nombre || '', [Validators.required, Validators.maxLength(50)]],
      descripcion: [this.data?.rol?.descripcion || '', Validators.maxLength(200)],
      nivelPermiso: [this.data?.rol?.nivelPermiso || null, Validators.required]
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const obs = this.isEdit
      ? this.rolService.update(this.data.rol!.id, this.form.value)
      : this.rolService.create(this.form.value);

    obs.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Rol actualizado' : 'Rol creado');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Error al guardar el rol');
      }
    });
  }
}
