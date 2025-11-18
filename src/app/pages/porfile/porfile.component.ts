import { Component } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users1Service } from './users1.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-porfile',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule, CommonModule],
  templateUrl: './porfile.component.html',
  styleUrl: './porfile.component.css'
})
export class PorfileComponent {
  porfileForm: FormGroup;
  perfil: any = {};
  loading: boolean = false;
  constructor(private fb: FormBuilder, private users1Service: Users1Service) {
    this.porfileForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.cargarDatosUsuario();
  }

goBack() {
  window.history.back();
}

actualizarDatos() {
  console.log("Datos enviados:", this.perfil);

  // Aquí llamas a tu servicio PUT
  this.users1Service.updateProfile(this.perfil).subscribe({
    next: () => alert("Información actualizada correctamente"),
    error: err => console.error("Error al actualizar:", err)
  });
}
  cargarDatosUsuario() {
    this.users1Service.getProfile().subscribe({     
      next: (data) => {
        this.perfil = data;
        this.porfileForm.patchValue({
          user_name: this.perfil.user_name,
          phone: this.perfil.phone,
          email: this.perfil.email
        });
      }
    });
  }
}
