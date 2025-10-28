import { CommonModule } from '@angular/common';
import {HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import DOMPurify from 'dompurify';
import { throwConfetti } from '../../utils/confetti';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  nombre: String = '';
  correo: string = '';
  telefono: string = '';
  password: string = '';
  confirm_password = "";
  errorMsg: string = '';
  successMsg: String = '';

  constructor(private http: HttpClient, private router: Router) {}


  onLogin() {
    this.errorMsg = '';

    if (!this.nombre.trim() ||!this.correo.trim() ||!this.telefono.trim() || !this.password.trim() || !this.confirm_password.trim()) {
      this.errorMsg = 'Completa todos los campos.';
      return;
    }

     // Validar correo con expresión regular
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailRegex.test(this.correo)) {
      this.errorMsg = 'El correo no es válido.';
      return;
    }

    if (this.password.length < 8) {
        this.errorMsg = 'La contraseña debe tener al menos 8 caracteres.';
        return;
      }

      const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

if (!regex.test(this.password)) {
  this.errorMsg = 'La contraseña debe contener al menos una mayúscula y un carácter especial.';
  return;
}

if(this.password != this.confirm_password){
   this.errorMsg = "Las Contrasenas no coinciden";
   return;
}

if (!/^\d+$/.test(this.telefono)) {
  this.errorMsg = 'Ingresa un teléfono válido';
  return;
}



       // Enviar datos al backend
    this.http.post<any>('http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/crearUsuarios.php', {
      nombre: this.nombre,
      correo: DOMPurify.sanitize(this.correo),
      telefono: this.telefono !== '' ? Number(this.telefono) : null,
      password: DOMPurify.sanitize(this.password)
    }).subscribe(
      res => {
        if (res.success) {
          this.successMsg = res.success;
          this.nombre = '';
          this.correo = '';
          this.telefono ='';
          this.password = '';
          this.confirm_password="";
          throwConfetti();
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.errorMsg = res.error;
        }
      },
      err => this.errorMsg = 'Error al conectar con el servidor'
    );

  }
}
