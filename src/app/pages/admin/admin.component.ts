import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from './list/listusers/users.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {


user_name: string = '';
email: string = '';
phone: string = '';
rol: string = '';
status: string = '';

constructor(private userService: UserService) { }

//Method to create user with validation
onCreateUser() {

if (!this.user_name.trim() || !this.email.trim() || !this.phone.trim() || !this.rol.trim() || !this.status.trim()) {
  alert('Por favor, completa todos los campos.');
  return;
}  

// Validar correo con expresión regular
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      alert('El correo no es válido.');
      return;
    }

if (!/^\d+$/.test(this.phone)) {
 alert('El número de teléfono debe contener solo dígitos.');
  return;
}

const createUser = {
      user_name: this.user_name,
      rol: this.rol,
      status: this.status,
      phone: this.phone,
      email: this.email,
    };

this.userService.createUser(createUser
  ).subscribe({
    next: (data) => {
      alert('Usuario creado con éxito');
      this.clearForm();
    },
    error: (err) => {
      console.error('Error al crear usuario:', err);
      alert('Error al crear usuario. Por favor, intenta de nuevo.');
    }
  }); 

}
// limpiar formulario
clearForm() {
  this.user_name = '';
  this.email = '';
  this.phone = '';
  this.rol = '';
  this.status = '';
}

}
