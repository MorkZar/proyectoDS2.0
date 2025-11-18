import { Component } from '@angular/core';
import { Users1Service } from '../users1.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-datosuser',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './datosuser.component.html',
  styleUrl: './datosuser.component.css'
})
export class DatosuserComponent {
 perfil: any = {
    user_name: '',
    email: '',
    phone: ''
  };

  constructor(private users1Service: Users1Service) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
  this.users1Service.getProfile().subscribe({
    next: (data) => {
      console.log("Perfil cargado:", data);
      this.perfil = data;   // <--- ASIGNARLO AQUÍ
    },
    error: (err) => {
      console.error("Error cargando perfil:", err);
    }
  });
}

goBack() {
  window.history.back();
}

}
