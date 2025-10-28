// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthoService } from '../login/autho.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthoService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const token = authService.getToken();

  // Clonar la petición si hay token
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado';
      if (error.status === 400) message = 'Solicitud inválida';
      else if (error.status === 401) {
        message = 'No autorizado';
        router.navigate(['/login']);
      } else if (error.status === 403) {
        message = 'Acceso denegado';
        router.navigate(['/home']);
      }

      snackBar.open(message, 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-error']
      });

      return throwError(() => new Error(message));
    })
  );
};

