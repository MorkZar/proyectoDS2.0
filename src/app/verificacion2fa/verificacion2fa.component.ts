import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import DOMPurify from 'dompurify';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-verificacion2fa',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './verificacion2fa.component.html',
  styleUrls: ['./verificacion2fa.component.css']
})
export class Verificacion2faComponent {
  form: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  verificarCodigo() {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (this.form.invalid) {
      this.mensajeError = 'Ingresa un código válido de 6 dígitos';
      return;
    }

    const codigo = DOMPurify.sanitize(this.form.value.codigo);
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      this.mensajeError = 'No se encontró sesión de usuario.';
      return;
    }

    this.http.post<any>(
      'http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/a2f.php',
      { user_id, code: codigo }
    ).subscribe({
      next: (res) => {
        if (res.success && res.token) {
          // Guardar tokens en localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('refresh_token', res.refresh_token);

          this.mensajeExito = 'Autenticación 2FA correcta. Redirigiendo...';

          console.log(document.cookie); // muestra todas las cookies accesibles
          console.log('📌 Token:', res.token);
          console.log('📌 Refresh Token:', res.refresh_token);

          // Decodificar el token para obtener el rol
          const decoded: any = jwt_decode(res.token);
          const rol = decoded.data.rol;

          // Redirigir según el rol
          if (rol === 'admin') {
           this.router.navigate(['/dashboard-administracion']);
          } else if (rol === 'user') {
          const lavadora = document.getElementById('lavadora');
           if (lavadora) {
            lavadora.classList.add('active');
            // Espera la animación y redirige
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 3500); // Tiempo igual o un poco mayor al de la animación CSS
          }
        }
        } else {
          this.mensajeError = res.error || 'Código incorrecto.';
        }
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Error al conectar con el servidor.';
      }
    });
  }
}

