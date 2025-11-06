import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthoService } from './login/autho.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authoService: AuthoService, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    if (!this.authoService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = this.authoService.getUserRole();
    
     if (role === 'admin') {
      return true;
    }

    
    this.snackBar.open('Acceso denegado: solo administradores', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
      setTimeout(() => {
       this.router.navigate(['/login']);
      }, 100);
    return false;
  }
}
