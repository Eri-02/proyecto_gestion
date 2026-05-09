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
import { EstadoService } from '../../../core/services/estado.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EstadoResponse } from '../../../core/models/estado.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-estado-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>{{ data.item ? 'Editar' : 'Crear' }} Estado</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline"><mat-label>Nombre</mat-label><input matInput formControlName="nombre"><mat-error>Requerido</mat-error></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Descripción</mat-label><input matInput formControlName="descripcion"></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Color (ej: #00d4ff)</mat-label><input matInput formControlName="color"></mat-form-field>
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
export class EstadoFormDialogComponent implements OnInit {
  form!: FormGroup; saving=false;
  constructor(public ref: MatDialogRef<EstadoFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:{item?:EstadoResponse}, private fb:FormBuilder, private svc:EstadoService, private n:NotificationService){}
  ngOnInit(){
    const e=this.data.item;
    this.form=this.fb.group({ nombre:[e?.nombre||'',Validators.required], descripcion:[e?.descripcion||''], color:[e?.color||''] });
  }
  save(){
    if(this.form.invalid)return; this.saving=true;
    const obs=this.data.item?this.svc.update(this.data.item.id,this.form.value):this.svc.create(this.form.value);
    obs.subscribe({next:()=>{this.n.success('Guardado');this.ref.close(true)},error:()=>{this.saving=false;this.n.error('Error')}});
  }
}

@Component({
  selector: 'app-estado-list',
  standalone: true,
  imports: [CommonModule,MatTableModule,MatPaginatorModule,MatSortModule,MatButtonModule,MatIconModule,MatProgressSpinnerModule,MatTooltipModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Estados</h1>
        <button mat-flat-button color="primary" (click)="openForm()" class="btn-new"><mat-icon>add</mat-icon> Nuevo Estado</button>
      </div>
      <div class="card">
        <div *ngIf="loading" class="loading-shade"><mat-spinner diameter="40"></mat-spinner></div>
        <table mat-table [dataSource]="ds" matSort class="full-width">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th><td mat-cell *matCellDef="let e">#{{e.id}}</td></ng-container>
          <ng-container matColumnDef="nombre"><th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th><td mat-cell *matCellDef="let e">{{e.nombre}}</td></ng-container>
          <ng-container matColumnDef="descripcion"><th mat-header-cell *matHeaderCellDef>Descripción</th><td mat-cell *matCellDef="let e">{{e.descripcion||'—'}}</td></ng-container>
          <ng-container matColumnDef="color"><th mat-header-cell *matHeaderCellDef>Color</th><td mat-cell *matCellDef="let e"><span class="color-dot" [style.background]="e.color||'#666'"></span>{{e.color||'—'}}</td></ng-container>
          <ng-container matColumnDef="acciones"><th mat-header-cell *matHeaderCellDef>Acciones</th><td mat-cell *matCellDef="let e"><button mat-icon-button matTooltip="Editar" (click)="openForm(e)"><mat-icon>edit</mat-icon></button><button mat-icon-button matTooltip="Eliminar" color="warn" (click)="del(e)"><mat-icon>delete</mat-icon></button></td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <mat-paginator [pageSizeOptions]="[10,25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`.btn-new{border-radius:12px;font-weight:600;mat-icon{margin-right:4px}}.full-width{width:100%}.loading-shade{min-height:200px;display:flex;align-items:center;justify-content:center}.color-dot{display:inline-block;width:14px;height:14px;border-radius:50%;margin-right:6px;vertical-align:middle}`]
})
export class EstadoListComponent implements OnInit {
  cols=['id','nombre','descripcion','color','acciones'];
  ds=new MatTableDataSource<EstadoResponse>([]);
  loading=true;
  @ViewChild(MatPaginator)pag!:MatPaginator;
  @ViewChild(MatSort)sort!:MatSort;
  constructor(private svc:EstadoService,private n:NotificationService,private dialog:MatDialog){}
  ngOnInit(){this.load();}
  load(){this.loading=true;this.svc.getAll().subscribe({next:d=>{this.ds.data=d;setTimeout(()=>{this.ds.paginator=this.pag;this.ds.sort=this.sort;});this.loading=false;},error:()=>{this.n.error('Error');this.loading=false;}});}
  openForm(e?:EstadoResponse){this.dialog.open(EstadoFormDialogComponent,{width:'500px',data:{item:e}}).afterClosed().subscribe(ok=>{if(ok)this.load();});}
  del(e:EstadoResponse){this.dialog.open(ConfirmDialogComponent,{width:'420px',data:{title:'Eliminar',message:`¿Eliminar "${e.nombre}"?`}}).afterClosed().subscribe(ok=>{if(ok)this.svc.delete(e.id).subscribe({next:()=>{this.n.success('Eliminado');this.load();},error:()=>this.n.error('Error')});});}
}
