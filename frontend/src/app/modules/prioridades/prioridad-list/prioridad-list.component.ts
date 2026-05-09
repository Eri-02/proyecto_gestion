import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { PrioridadService } from '../../../core/services/prioridad.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PrioridadResponse } from '../../../core/models/prioridad.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-prioridad-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>{{ data.item ? 'Editar' : 'Crear' }} Prioridad</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="nombre"><mat-error>Requerido</mat-error></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Nivel (1-4)</mat-label><input matInput type="number" formControlName="nivel" min="1" max="4"><mat-error>1-4</mat-error></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Color (ej: #ff3d57)</mat-label><input matInput formControlName="color"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Tiempo Resolución Esperado (horas)</mat-label><input matInput type="number" formControlName="tiempoResolucionEsperadoHoras"></mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="ref.close(false)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid||saving">
        <mat-spinner *ngIf="saving" diameter="18"></mat-spinner><span *ngIf="!saving">Guardar</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.dialog-form{display:flex;flex-direction:column;gap:4px;min-width:400px;padding-top:8px}`]
})
export class PrioridadFormDialogComponent implements OnInit {
  form!: FormGroup; saving=false;
  constructor(public ref: MatDialogRef<PrioridadFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:{item?:PrioridadResponse}, private fb:FormBuilder, private svc:PrioridadService, private n:NotificationService){}
  ngOnInit(){
    const p=this.data.item;
    this.form=this.fb.group({ nombre:[p?.nombre||'',Validators.required], nivel:[p?.nivel||1,[Validators.required,Validators.min(1),Validators.max(4)]], color:[p?.color||''], tiempoResolucionEsperadoHoras:[p?.tiempoResolucionEsperadoHoras||null] });
  }
  save(){
    if(this.form.invalid)return; this.saving=true;
    const obs=this.data.item?this.svc.update(this.data.item.id,this.form.value):this.svc.create(this.form.value);
    obs.subscribe({next:()=>{this.n.success('Guardado');this.ref.close(true)},error:()=>{this.saving=false;this.n.error('Error')}});
  }
}

@Component({
  selector: 'app-prioridad-list',
  standalone: true,
  imports: [CommonModule,MatTableModule,MatPaginatorModule,MatSortModule,MatButtonModule,MatIconModule,MatProgressSpinnerModule,MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Prioridades</h1>
        <button mat-flat-button color="primary" (click)="openForm()" class="btn-new"><mat-icon>add</mat-icon> Nueva Prioridad</button>
      </div>
      <div class="card">
        <div *ngIf="loading" class="loading-shade"><mat-spinner diameter="40"></mat-spinner></div>
        <table mat-table [dataSource]="ds" matSort class="full-width">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th><td mat-cell *matCellDef="let p">#{{p.id}}</td></ng-container>
          <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th><td mat-cell *matCellDef="let p">{{p.nombre}}</td></ng-container>
          <ng-container matColumnDef="nivel"><th mat-header-cell *matHeaderCellDef mat-sort-header>Nivel</th><td mat-cell *matCellDef="let p">{{p.nivel}}</td></ng-container>
          <ng-container matColumnDef="color"><th mat-header-cell *matHeaderCellDef>Color</th><td mat-cell *matCellDef="let p"><span class="color-dot" [style.background]="p.color || '#666'"></span> {{p.color||'—'}}</td></ng-container>
          <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let p"><button mat-icon-button matTooltip="Editar" (click)="openForm(p)"><mat-icon>edit</mat-icon></button><button mat-icon-button matTooltip="Eliminar" color="warn" (click)="del(p)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[10,25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.btn-new{border-radius:12px;font-weight:600;mat-icon{margin-right:4px}}.full-width{width:100%}.loading-shade{min-height:200px;display:flex;align-items:center;justify-content:center}.color-dot{display:inline-block;width:14px;height:14px;border-radius:50%;margin-right:6px;vertical-align:middle}`]
})
export class PrioridadListComponent implements OnInit {
  cols=['id','nombre','nivel','color','acciones'];
  ds=new MatTableDataSource<PrioridadResponse>([]);
  loading=true;
  @ViewChild(MatPaginator)pag!:MatPaginator;
  @ViewChild(MatSort)sort!:MatSort;
  constructor(private svc:PrioridadService,private n:NotificationService,private dialog:MatDialog){}
  ngOnInit(){this.load();}
  load(){this.loading=true;this.svc.getAll().subscribe({next:d=>{this.ds.data=d;setTimeout(()=>{this.ds.paginator=this.pag;this.ds.sort=this.sort;});this.loading=false;},error:()=>{this.n.error('Error');this.loading=false;}});}
  openForm(p?:PrioridadResponse){this.dialog.open(PrioridadFormDialogComponent,{width:'500px',data:{item:p}}).afterClosed().subscribe(ok=>{if(ok)this.load();});}
  del(p:PrioridadResponse){this.dialog.open(ConfirmDialogComponent,{width:'420px',data:{title:'Eliminar',message:`¿Eliminar "${p.nombre}"?`}}).afterClosed().subscribe(ok=>{if(ok)this.svc.delete(p.id).subscribe({next:()=>{this.n.success('Eliminado');this.load();},error:()=>this.n.error('Error')});});}
}
