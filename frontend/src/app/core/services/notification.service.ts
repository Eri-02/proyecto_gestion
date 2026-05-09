import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 6000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
