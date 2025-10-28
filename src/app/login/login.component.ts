import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMsg: string = '';
  successMsg: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin1() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.correo.trim() || !this.password.trim()) {
      this.errorMsg = 'Completa correo y contraseña.';
      return;
    }

    this.http.post<any>(
      'http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/iniciarsesion.php',
      {
        correo: DOMPurify.sanitize(this.correo),
        password: DOMPurify.sanitize(this.password)
      }
    ).subscribe({
      next: (res) => {
        console.log('Respuesta backend login:', res);

        if (res.success && res.user_id) {
          // Código enviado correctamente
          this.successMsg = 'Se ha enviado un código de verificación a tu celular.';

          // Guardar user_id para el componente de verificación
          localStorage.setItem('user_id', res.user_id);

          // Redirigir a la pantalla de verificación
          setTimeout(() => {
            this.router.navigate(['/verificacion2fa']);
          }, 1500);
        } else {
          this.errorMsg = res.error || 'Error al iniciar sesión.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al conectar con el servidor.';
      }
    });
  }
}



      
