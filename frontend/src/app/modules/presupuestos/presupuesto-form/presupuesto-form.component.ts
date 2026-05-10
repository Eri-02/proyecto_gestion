import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PresupuestoService } from '../../../core/services/presupuesto.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-presupuesto-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatDatepickerModule,
    MatNativeDateModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <button mat-icon-button (click)="router.navigate(['/presupuestos'])">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>{{ isEdit ? 'Editar Presupuesto' : 'Nuevo Presupuesto' }}</h1>
        </div>
      </div>

      <div *ngIf="loading" class="loading-shade">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <mat-card class="form-card" *ngIf="!loading">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="save()" class="budget-form">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre del presupuesto</mat-label>
                <input matInput formControlName="nombre" maxlength="120">
                <mat-error>El nombre es obligatorio</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Periodo</mat-label>
                <mat-date-range-input [rangePicker]="picker">
                  <input matStartDate formControlName="fechaInicio" placeholder="Inicio">
                  <input matEndDate formControlName="fechaFin" placeholder="Fin">
                </mat-date-range-input>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-date-range-picker #picker></mat-date-range-picker>
                <mat-error>Seleccione un periodo valido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Monto presupuestado</mat-label>
                <input matInput type="number" formControlName="montoPresupuestado" min="1" step="0.01">
                <mat-error>Ingrese un monto mayor a cero</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Umbral de alerta (%)</mat-label>
                <input matInput type="number" formControlName="umbralAlertaPorcentaje" min="0" max="999" step="0.01">
                <mat-error>Ingrese un umbral valido</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Descripción</mat-label>
                <textarea matInput formControlName="descripcion" rows="4" maxlength="250"></textarea>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="router.navigate(['/presupuestos'])">Cancelar</button>
              <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving">
                <mat-icon>save</mat-icon> Guardar
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .header-left { display: flex; align-items: center; gap: 8px; }
    .form-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius); max-width: 920px; }
    .budget-form { display: flex; flex-direction: column; gap: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { grid-column: 1 / -1; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; }
    .form-actions mat-icon { margin-right: 4px; }
    .loading-shade { position: relative; min-height: 320px; display: flex; align-items: center; justify-content: center; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: auto; } }
  `]
})
export class PresupuestoFormComponent implements OnInit {
  form = this.fb.group({
    nombre: ['', Validators.required],
    fechaInicio: [null as Date | null, Validators.required],
    fechaFin: [null as Date | null, Validators.required],
    montoPresupuestado: [null as number | null, [Validators.required, Validators.min(1)]],
    umbralAlertaPorcentaje: [85, [Validators.required, Validators.min(0), Validators.max(999)]],
    descripcion: ['']
  });

  isEdit = false;
  loading = false;
  saving = false;
  private presupuestoId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private presupuestoService: PresupuestoService,
    private notification: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.presupuestoId = +id;
      this.loadPresupuesto(this.presupuestoId);
    }
  }

  loadPresupuesto(id: number): void {
    this.loading = true;
    this.presupuestoService.getById(id).subscribe({
      next: (p) => {
        this.form.patchValue({
          nombre: p.nombre,
          fechaInicio: p.fechaInicio ? new Date(p.fechaInicio) : null,
          fechaFin: p.fechaFin ? new Date(p.fechaFin) : null,
          montoPresupuestado: p.montoPresupuestado,
          umbralAlertaPorcentaje: p.umbralAlertaPorcentaje,
          descripcion: p.descripcion
        });
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar presupuesto');
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const value = this.form.getRawValue();
    const payload = {
      nombre: value.nombre || '',
      fechaInicio: this.toDateString(value.fechaInicio),
      fechaFin: this.toDateString(value.fechaFin),
      montoPresupuestado: value.montoPresupuestado || 0,
      umbralAlertaPorcentaje: value.umbralAlertaPorcentaje || 85,
      creadoPorUsuarioId: this.authService.getUserId(),
      descripcion: value.descripcion || undefined
    };

    const request = this.isEdit && this.presupuestoId
      ? this.presupuestoService.update(this.presupuestoId, payload)
      : this.presupuestoService.create(payload);

    request.subscribe({
      next: () => {
        this.notification.success('Presupuesto guardado correctamente');
        this.router.navigate(['/presupuestos']);
      },
      error: () => {
        this.notification.error('Error al guardar presupuesto');
        this.saving = false;
      }
    });
  }

  private toDateString(date: Date | null): string {
    return date ? date.toISOString().split('T')[0] : '';
  }
}
