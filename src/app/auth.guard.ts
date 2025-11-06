
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthoService } from './login/autho.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authoService: AuthoService, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
  if (!this.authoService.isAuthenticated()) {
    this.router.navigate(['/login']);
    return false;
  }

  // Deja pasar a cualquier usuario autenticado
  return true;
}

  private handleUnauthorizedAccess(): boolean {
    
    this.snackBar.open('Acceso denegado: No ha Iniciado Sesion', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });

    this.router.navigate(['/login']); 
    return false;
}
}

