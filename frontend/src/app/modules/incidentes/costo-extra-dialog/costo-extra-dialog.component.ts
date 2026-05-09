import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CostoExtraService } from '../../../core/services/costo-extra.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-costo-extra-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule,
    MatNativeDateModule, MatCheckboxModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Agregar Costo Extra</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Concepto</mat-label>
          <input matInput formControlName="concepto" placeholder="Descripción del costo">
          <mat-error>El concepto es requerido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Monto (USD)</mat-label>
          <input matInput type="number" formControlName="monto" min="0.01">
          <mat-error>El monto debe ser mayor a 0</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fecha">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error>Seleccione una fecha</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoria">
            <mat-option value="Herramientas">Herramientas</mat-option>
            <mat-option value="Licencias">Licencias</mat-option>
            <mat-option value="ServiciosExternos">Servicios Externos</mat-option>
            <mat-option value="Consultoría">Consultoría</mat-option>
            <mat-option value="Otros">Otros</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Proveedor (opcional)</mat-label>
          <input matInput formControlName="proveedor">
        </mat-form-field>

        <mat-checkbox formControlName="facturable" color="primary">Facturable</mat-checkbox>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid || saving">
        <mat-spinner *ngIf="saving" diameter="18"></mat-spinner>
        <span *ngIf="!saving">Guardar</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 400px;
      padding-top: 8px;
    }
    @media (max-width: 500px) {
      .dialog-form { min-width: unset; }
    }
  `]
})
export class CostoExtraDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CostoExtraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { incidenteId: number },
    private fb: FormBuilder,
    private costoExtraService: CostoExtraService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      concepto: ['', [Validators.required, Validators.maxLength(200)]],
      monto: [null, [Validators.required, Validators.min(0.01)]],
      fecha: [new Date(), Validators.required],
      categoria: ['Otros'],
      proveedor: [''],
      facturable: [true]
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const val = this.form.value;
    const fecha = val.fecha instanceof Date
      ? val.fecha.toISOString().split('T')[0]
      : val.fecha;

    this.costoExtraService.create({
      incidenteId: this.data.incidenteId,
      usuarioRegistraId: this.authService.getUserId(),
      concepto: val.concepto,
      monto: val.monto,
      fecha: fecha,
      categoria: val.categoria,
      proveedor: val.proveedor,
      facturable: val.facturable
    }).subscribe({
      next: () => {
        this.notification.success('Costo extra registrado correctamente');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Error al registrar costo extra');
      }
    });
  }
}
