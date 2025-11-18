import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent {
constructor(private http: HttpClient,) {}

passwordActual = '';
nuevaPassword = '';
confirmPassword = '';

cambiarPassword() {
  const data = {
    password_actual: this.passwordActual,
    nueva_password: this.nuevaPassword
  };

  this.http.put('http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/apiPass.php', data).subscribe({
    next: (res) => {
      alert('Contraseña actualizada exitosamente');
    },
    error: (err) => {
      alert('Error: ' + err.error?.error);
    }
  });
}

goBack() {
  window.history.back();
}
}
