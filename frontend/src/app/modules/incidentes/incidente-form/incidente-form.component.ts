import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { IncidenteService } from '../../../core/services/incidente.service';
import { PrioridadService } from '../../../core/services/prioridad.service';
import { EstadoService } from '../../../core/services/estado.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PrioridadResponse } from '../../../core/models/prioridad.model';
import { EstadoResponse } from '../../../core/models/estado.model';

@Component({
  selector: 'app-incidente-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>{{ isEdit ? 'Editar Incidente' : 'Nuevo Incidente' }}</h1>
        <button mat-stroked-button (click)="router.navigate(['/incidentes'])">
          <mat-icon>arrow_back</mat-icon> Volver
        </button>
      </div>

      <div *ngIf="loadingData" class="loading-shade">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="card form-card" *ngIf="!loadingData">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Titulo -->
            <mat-form-field appearance="outline" class="full-span">
              <mat-label>Título</mat-label>
              <input matInput formControlName="titulo" placeholder="Título del incidente">
              <mat-error *ngIf="form.get('titulo')?.hasError('required')">El título es requerido</mat-error>
            </mat-form-field>

            <!-- Descripcion -->
            <mat-form-field appearance="outline" class="full-span">
              <mat-label>Descripción</mat-label>
              <textarea matInput formControlName="descripcion" rows="4" placeholder="Describa el incidente..."></textarea>
              <mat-error *ngIf="form.get('descripcion')?.hasError('required')">La descripción es requerida</mat-error>
              <mat-error *ngIf="form.get('descripcion')?.hasError('minlength')">Mínimo 10 caracteres</mat-error>
            </mat-form-field>

            <!-- Prioridad -->
            <mat-form-field appearance="outline">
              <mat-label>Prioridad</mat-label>
              <mat-select formControlName="prioridadId">
                <mat-option *ngFor="let p of prioridades" [value]="p.id">{{ p.nombre }}</mat-option>
              </mat-select>
              <mat-error>La prioridad es requerida</mat-error>
            </mat-form-field>

            <!-- Estado -->
            <mat-form-field appearance="outline">
              <mat-label>Estado</mat-label>
              <mat-select formControlName="estadoId">
                <mat-option *ngFor="let e of estados" [value]="e.id">{{ e.nombre }}</mat-option>
              </mat-select>
              <mat-error>El estado es requerido</mat-error>
            </mat-form-field>

            <!-- Costo Estimado -->
            <mat-form-field appearance="outline">
              <mat-label>Costo Estimado (USD)</mat-label>
              <mat-icon matPrefix>attach_money</mat-icon>
              <input matInput type="number" formControlName="costoEstimado" min="0">
              <mat-error *ngIf="form.get('costoEstimado')?.hasError('required')">El costo es requerido</mat-error>
              <mat-error *ngIf="form.get('costoEstimado')?.hasError('min')">Debe ser mayor a 0</mat-error>
            </mat-form-field>

            <!-- Ingresos -->
            <mat-form-field appearance="outline">
              <mat-label>Ingresos (USD)</mat-label>
              <mat-icon matPrefix>attach_money</mat-icon>
              <input matInput type="number" formControlName="ingresos" min="0">
            </mat-form-field>

            <!-- Cliente -->
            <mat-form-field appearance="outline">
              <mat-label>Cliente</mat-label>
              <input matInput formControlName="cliente" placeholder="Nombre del cliente">
            </mat-form-field>

            <!-- Sistema Afectado -->
            <mat-form-field appearance="outline">
              <mat-label>Sistema Afectado</mat-label>
              <input matInput formControlName="sistemaAfectado" placeholder="Sistema o aplicación">
            </mat-form-field>

            <!-- Descripción Técnica -->
            <mat-form-field appearance="outline" class="full-span">
              <mat-label>Descripción Técnica</mat-label>
              <textarea matInput formControlName="descripcionTecnica" rows="3" placeholder="Detalles técnicos..."></textarea>
            </mat-form-field>

            <!-- Lecciones Aprendidas -->
            <mat-form-field appearance="outline" class="full-span">
              <mat-label>Lecciones Aprendidas</mat-label>
              <textarea matInput formControlName="leccionesAprendidas" rows="3" placeholder="Lecciones aprendidas..."></textarea>
            </mat-form-field>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button mat-stroked-button type="button" (click)="router.navigate(['/incidentes'])">Cancelar</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || saving">
              <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
              <span *ngIf="!saving">{{ isEdit ? 'Actualizar' : 'Crear' }} Incidente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-card { padding: 32px; }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 20px;
    }

    .full-span { grid-column: 1 / -1; }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);

      button {
        min-width: 160px;
        height: 44px;
        border-radius: 10px;
        font-weight: 600;
      }
    }

    .loading-shade {
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class IncidenteFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  incidenteId?: number;
  saving = false;
  loadingData = true;
  prioridades: PrioridadResponse[] = [];
  estados: EstadoResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private incidenteService: IncidenteService,
    private prioridadService: PrioridadService,
    private estadoService: EstadoService,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      prioridadId: [null, Validators.required],
      estadoId: [null, Validators.required],
      costoEstimado: [null, [Validators.required, Validators.min(0.01)]],
      ingresos: [0],
      cliente: [''],
      sistemaAfectado: [''],
      descripcionTecnica: [''],
      leccionesAprendidas: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.incidenteId = +id;
    }

    this.loadCatalogs();
  }

  loadCatalogs(): void {
    forkJoin({
      prioridades: this.prioridadService.getAll(),
      estados: this.estadoService.getAll()
    }).subscribe({
      next: ({ prioridades, estados }) => {
        this.prioridades = prioridades;
        this.estados = estados;

        if (this.isEdit && this.incidenteId) {
          this.loadIncidente();
        } else {
          this.loadingData = false;
        }
      },
      error: () => {
        this.notification.error('Error al cargar catálogos');
        this.loadingData = false;
      }
    });
  }

  loadIncidente(): void {
    this.incidenteService.getById(this.incidenteId!).subscribe({
      next: (inc) => {
        this.form.patchValue({
          titulo: inc.titulo,
          descripcion: inc.descripcion,
          prioridadId: inc.prioridadId,
          estadoId: inc.estadoId,
          costoEstimado: inc.costoEstimado,
          ingresos: inc.ingresos,
          cliente: inc.cliente,
          sistemaAfectado: inc.sistemaAfectado,
          descripcionTecnica: inc.descripcionTecnica,
          leccionesAprendidas: inc.leccionesAprendidas
        });
        this.loadingData = false;
      },
      error: () => {
        this.notification.error('Error al cargar incidente');
        this.loadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const data = {
      ...this.form.value,
      creadoPorUsuarioId: this.authService.getUserId()
    };

    const obs = this.isEdit
      ? this.incidenteService.update(this.incidenteId!, data)
      : this.incidenteService.create(data);

    obs.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Incidente actualizado' : 'Incidente creado');
        this.router.navigate(['/incidentes']);
      },
      error: (err) => {
        this.saving = false;
        this.notification.error(err.error?.message || 'Error al guardar incidente');
      }
    });
  }
}
