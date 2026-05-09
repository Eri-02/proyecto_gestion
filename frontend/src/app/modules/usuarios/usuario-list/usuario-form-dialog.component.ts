import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuarioService } from '../../../core/services/usuario.service';
import { RolService } from '../../../core/services/rol.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioResponse } from '../../../core/models/usuario.model';
import { RolResponse } from '../../../core/models/rol.model';

@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Editar' : 'Crear' }} Usuario</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username">
          <mat-error>El username es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ isEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña' }}</mat-label>
          <input matInput type="password" formControlName="password">
          <mat-error>La contraseña es requerida</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email">
          <mat-error>Email válido requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre Completo</mat-label>
          <input matInput formControlName="nombreCompleto">
          <mat-error>El nombre es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="rolId">
            <mat-option *ngFor="let r of roles" [value]="r.id">{{ r.nombre }}</mat-option>
          </mat-select>
          <mat-error>Seleccione un rol</mat-error>
        </mat-form-field>

        <mat-slide-toggle formControlName="activo" color="primary">Activo</mat-slide-toggle>
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
export class UsuarioFormDialogComponent implements OnInit {
  form!: FormGroup;
  roles: RolResponse[] = [];
  isEdit = false;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<UsuarioFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario?: UsuarioResponse },
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data?.usuario;

    this.form = this.fb.group({
      username: [this.data?.usuario?.username || '', Validators.required],
      password: ['', this.isEdit ? [] : [Validators.required]],
      email: [this.data?.usuario?.email || '', [Validators.required, Validators.email]],
      nombreCompleto: [this.data?.usuario?.nombreCompleto || '', Validators.required],
      rolId: [this.data?.usuario?.rolId || null, Validators.required],
      activo: [this.data?.usuario?.activo ?? true]
    });

    this.rolService.getAll().subscribe({
      next: (r) => this.roles = r,
      error: () => this.notification.error('Error al cargar roles')
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const val = this.form.value;
    // If editing and password is empty, set a placeholder (backend should handle this)
    if (this.isEdit && !val.password) {
      val.password = 'unchanged';
    }

    const obs = this.isEdit
      ? this.usuarioService.update(this.data.usuario!.id, val)
      : this.usuarioService.create(val);

    obs.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Usuario actualizado' : 'Usuario creado');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Error al guardar usuario');
      }
    });
  }
}
