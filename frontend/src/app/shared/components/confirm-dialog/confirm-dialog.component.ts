import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: 'warn' | 'primary' | 'accent';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-icon">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2>{{ data.title }}</h2>
      <p>{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="dialogRef.close(false)">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-flat-button [color]="data.color || 'warn'" (click)="dialogRef.close(true)">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      text-align: center;
      padding: 16px 8px;
    }
    .dialog-icon {
      margin-bottom: 16px;
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--accent-orange);
      }
    }
    h2 {
      margin: 0 0 8px;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    p {
      margin: 0 0 24px;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    .dialog-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      button { min-width: 120px; }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
