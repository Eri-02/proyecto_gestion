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
import { RecursoService } from '../../../core/services/recurso.service';
import { HoraTrabajadaService } from '../../../core/services/hora-trabajada.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RecursoResponse } from '../../../core/models/recurso.model';

@Component({
  selector: 'app-hora-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule,
    MatNativeDateModule, MatCheckboxModule, MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>Registrar Horas Trabajadas</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Recurso</mat-label>
          <mat-select formControlName="recursoId">
            <mat-option *ngFor="let r of recursos" [value]="r.id">
              {{ r.nombre }} — {{ r.cargo }}
            </mat-option>
          </mat-select>
          <mat-error>Seleccione un recurso</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Horas</mat-label>
          <input matInput type="number" formControlName="horas" min="0.25" max="24" step="0.25">
          <mat-error>Ingrese horas entre 0.25 y 24</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha de Trabajo</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fechaTrabajo">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error>Seleccione una fecha</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción (opcional)</mat-label>
          <textarea matInput formControlName="descripcion" rows="2"></textarea>
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
export class HoraDialogComponent implements OnInit {
  form!: FormGroup;
  recursos: RecursoResponse[] = [];
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<HoraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { incidenteId: number },
    private fb: FormBuilder,
    private recursoService: RecursoService,
    private horaService: HoraTrabajadaService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      recursoId: [null, Validators.required],
      horas: [null, [Validators.required, Validators.min(0.25), Validators.max(24)]],
      fechaTrabajo: [new Date(), Validators.required],
      descripcion: [''],
      facturable: [true]
    });

    this.recursoService.getAll().subscribe({
      next: (r) => this.recursos = r.filter(res => res.activo !== false),
      error: () => this.notification.error('Error al cargar recursos')
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const val = this.form.value;
    const fecha = val.fechaTrabajo instanceof Date
      ? val.fechaTrabajo.toISOString().split('T')[0]
      : val.fechaTrabajo;

    this.horaService.create({
      incidenteId: this.data.incidenteId,
      recursoId: val.recursoId,
      usuarioRegistraId: this.authService.getUserId(),
      horas: val.horas,
      fechaTrabajo: fecha,
      descripcion: val.descripcion,
      facturable: val.facturable
    }).subscribe({
      next: () => {
        this.notification.success('Hora registrada correctamente');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Error al registrar hora');
      }
    });
  }
}
