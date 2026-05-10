import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuditoriaFinancieraService } from '../../core/services/auditoria-financiera.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuditoriaFinancieraResponse } from '../../core/models/auditoria-financiera.model';

@Component({
  selector: 'app-auditoria-financiera',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule,
    CurrencyPipe, DatePipe
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Auditoría Financiera</h1>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon cyan"><mat-icon>manage_search</mat-icon></div>
          <div>
            <span class="summary-value">{{ filteredData.length }}</span>
            <span class="summary-label">Registros auditados</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon orange"><mat-icon>payments</mat-icon></div>
          <div>
            <span class="summary-value">{{ totalValorAfectado | currency:'USD':'symbol':'1.0-0' }}</span>
            <span class="summary-label">Valor afectado</span>
          </div>
        </div>
        <div class="summary-card">
          <div class="summary-icon blue"><mat-icon>receipt_long</mat-icon></div>
          <div>
            <span class="summary-value">{{ incidentesAuditados }}</span>
            <span class="summary-label">Incidentes únicos</span>
          </div>
        </div>
      </div>

      <div class="card filters-bar" [formGroup]="filterForm">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [formControl]="searchControl" placeholder="Incidente, usuario o detalle">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rango de fechas</mat-label>
          <mat-date-range-input [rangePicker]="picker">
            <input matStartDate formControlName="inicio" placeholder="Inicio">
            <input matEndDate formControlName="fin" placeholder="Fin">
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo de cambio</mat-label>
          <mat-select formControlName="tipo">
            <mat-option value="">Todos</mat-option>
            <mat-option *ngFor="let tipo of tiposCambio" [value]="tipo">{{ tipo }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Acción</mat-label>
          <mat-select formControlName="accion">
            <mat-option value="">Todas</mat-option>
            <mat-option *ngFor="let accion of acciones" [value]="accion">{{ accion }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Entidad</mat-label>
          <mat-select formControlName="entidad">
            <mat-option value="">Todas</mat-option>
            <mat-option *ngFor="let entidad of entidades" [value]="entidad">{{ entidad }}</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="filter-actions">
          <button mat-flat-button color="accent" (click)="applyFilters()">
            <mat-icon>filter_list</mat-icon> Filtrar
          </button>
          <button mat-button (click)="clearFilters()">Limpiar</button>
        </div>
      </div>

      <div class="card table-card">
        <div *ngIf="loading" class="loading-shade">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="full-width">
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="fechaCambio">Fecha</th>
            <td mat-cell *matCellDef="let a">{{ a.fechaCambio | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>

          <ng-container matColumnDef="tipo">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="tipoCambio">Tipo</th>
            <td mat-cell *matCellDef="let a"><span class="chip" [ngClass]="getTipoClass(a.tipoCambio)">{{ a.tipoCambio }}</span></td>
          </ng-container>

          <ng-container matColumnDef="entidad">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="entidadAfectada">Entidad</th>
            <td mat-cell *matCellDef="let a">
              <div class="entity-cell">
                <strong>{{ a.accion || 'N/A' }}</strong>
                <span>{{ a.entidadAfectada || 'N/A' }} #{{ a.registroId || 'N/A' }}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="incidente">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="incidenteTitulo">Incidente</th>
            <td mat-cell *matCellDef="let a" class="cell-title" [matTooltip]="a.incidenteTitulo">#{{ a.incidenteId }} {{ a.incidenteTitulo }}</td>
          </ng-container>

          <ng-container matColumnDef="usuario">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="usuarioNombre">Usuario</th>
            <td mat-cell *matCellDef="let a">{{ a.usuarioNombre }}</td>
          </ng-container>

          <ng-container matColumnDef="valor">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="valorAfectado">Valor</th>
            <td mat-cell *matCellDef="let a">{{ (a.valorAfectado || 0) | currency:'USD':'symbol':'1.0-0' }}</td>
          </ng-container>

          <ng-container matColumnDef="detalle">
            <th mat-header-cell *matHeaderCellDef>Detalle</th>
            <td mat-cell *matCellDef="let a" class="cell-detail" [matTooltip]="a.detalle">{{ a.detalle || 'Sin detalle' }}</td>
          </ng-container>

          <ng-container matColumnDef="ip">
            <th mat-header-cell *matHeaderCellDef mat-sort-header="ipAddress">IP</th>
            <td mat-cell *matCellDef="let a">{{ a.ipAddress || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let a">
              <button mat-icon-button matTooltip="Ver incidente" (click)="router.navigate(['/incidentes', a.incidenteId])">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>

        <div *ngIf="!loading && !filteredData.length" class="empty-msg">
          <mat-icon>search_off</mat-icon>
          <p>No hay registros de auditoría financiera con los filtros seleccionados</p>
        </div>

        <mat-paginator [length]="totalElements"
                       [pageSize]="pageSize"
                       [pageSizeOptions]="[10, 25, 50]"
                       (page)="onPage($event)"
                       showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .summary-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 16px 20px; display: flex; align-items: center; gap: 14px; }
    .summary-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .summary-icon mat-icon { color: white; }
    .summary-icon.cyan { background: var(--gradient-cyan); }
    .summary-icon.orange { background: var(--gradient-orange); }
    .summary-icon.blue { background: var(--gradient-blue); }
    .summary-value { display: block; font-size: 1.35rem; font-weight: 700; color: var(--text-primary); }
    .summary-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .filters-bar { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; margin-bottom: 20px; padding: 16px 20px; }
    .filters-bar mat-form-field { flex: 1; min-width: 190px; }
    .search-field { flex: 2 !important; min-width: 260px !important; }
    .filter-actions { display: flex; gap: 8px; align-items: center; min-height: 56px; }
    .filter-actions mat-icon { margin-right: 4px; }
    .table-card { position: relative; padding: 0; overflow: hidden; }
    .full-width { width: 100%; }
    .cell-title { max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
    .cell-detail { max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-secondary); }
    .entity-cell { display: flex; flex-direction: column; gap: 3px; }
    .entity-cell strong { font-size: 0.82rem; color: var(--text-primary); }
    .entity-cell span { font-size: 0.75rem; color: var(--text-muted); }
    table th, table td { padding: 12px 16px !important; }
    .empty-msg { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px; color: var(--text-muted); }
    .empty-msg mat-icon { font-size: 44px; width: 44px; height: 44px; margin-bottom: 12px; }
    @media (max-width: 960px) { .filters-bar { flex-direction: column; } .filter-actions, .filters-bar mat-form-field { width: 100%; } }
  `]
})
export class AuditoriaFinancieraComponent implements OnInit {
  columns = ['fecha', 'tipo', 'entidad', 'incidente', 'usuario', 'valor', 'detalle', 'ip', 'acciones'];
  dataSource = new MatTableDataSource<AuditoriaFinancieraResponse>([]);
  allData: AuditoriaFinancieraResponse[] = [];
  filteredData: AuditoriaFinancieraResponse[] = [];
  loading = true;
  tiposCambio: string[] = [];
  acciones: string[] = [];
  entidades: string[] = [];
  totalElements = 0;
  pageSize = 25;
  pageIndex = 0;

  searchControl = new FormControl('');
  filterForm = new FormGroup({
    inicio: new FormControl<Date | null>(null),
    fin: new FormControl<Date | null>(null),
    tipo: new FormControl(''),
    accion: new FormControl(''),
    entidad: new FormControl('')
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public router: Router,
    private auditoriaService: AuditoriaFinancieraService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.subscribe(() => this.applyLocalSearch());
  }

  loadData(page = this.pageIndex, size = this.pageSize): void {
    this.loading = true;
    this.pageIndex = page;
    this.pageSize = size;
    const { inicio, fin, tipo, accion, entidad } = this.filterForm.value;
    this.auditoriaService.getAll({
      inicio: this.toDateString(inicio),
      fin: this.toDateString(fin),
      tipoCambio: tipo || undefined,
      accion: accion || undefined,
      entidadAfectada: entidad || undefined,
      page,
      size
    }).subscribe({
      next: (data) => {
        this.allData = data.content || [];
        this.totalElements = data.totalElements || 0;
        this.tiposCambio = [...new Set(this.allData.map(a => a.tipoCambio).filter(Boolean))].sort();
        this.acciones = [...new Set(this.allData.map(a => a.accion).filter(Boolean))].sort();
        this.entidades = [...new Set(this.allData.map(a => a.entidadAfectada).filter(Boolean))].sort();
        this.applyLocalSearch();
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
        this.loading = false;
      },
      error: () => {
        this.notification.error('Error al cargar auditoría financiera');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadData(0, this.pageSize);
  }

  applyLocalSearch(): void {
    const search = (this.searchControl.value || '').toLowerCase().trim();

    this.filteredData = this.allData.filter(a => {
      const matchesSearch = !search ||
        `${a.incidenteTitulo} ${a.usuarioNombre} ${a.detalle} ${a.ipAddress} ${a.accion} ${a.entidadAfectada}`.toLowerCase().includes(search);

      return matchesSearch;
    });

    this.dataSource.data = this.filteredData;
  }

  clearFilters(): void {
    this.searchControl.setValue('', { emitEvent: false });
    this.filterForm.reset({ inicio: null, fin: null, tipo: '', accion: '', entidad: '' });
    this.applyFilters();
  }

  onPage(event: PageEvent): void {
    this.loadData(event.pageIndex, event.pageSize);
  }

  private toDateString(date: Date | null | undefined): string | undefined {
    if (!date) return undefined;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  get totalValorAfectado(): number {
    return this.filteredData.reduce((acc, a) => acc + (a.valorAfectado || 0), 0);
  }

  get incidentesAuditados(): number {
    return new Set(this.filteredData.map(a => a.incidenteId)).size;
  }

  getTipoClass(tipo: string): string {
    const normalized = (tipo || '').toLowerCase();
    if (normalized.includes('costo') || normalized.includes('precio')) return 'chip-alta';
    if (normalized.includes('ingreso') || normalized.includes('margen')) return 'chip-media';
    if (normalized.includes('crear') || normalized.includes('nuevo')) return 'chip-nuevo';
    return 'chip-enanalisis';
  }
}
