import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  correo: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  enviarCorreo() {
    if (!this.correo.trim()) {
      this.mensaje = 'Ingresa tu correo.';
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(this.correo)) {
      this.mensaje = 'Correo inválido.';
      return;
    }

    this.http.post<any>('http://localhost/xampp/proyectoDS2/backend/recuperarContrasena.php', { correo: this.correo })
      .subscribe(
        res => this.mensaje = res.mensaje,
        err => this.mensaje = 'Error al conectar con el servidor'
      );
    }
}
