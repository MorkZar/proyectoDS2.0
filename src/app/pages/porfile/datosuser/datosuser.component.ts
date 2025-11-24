import { Component } from '@angular/core';
import { Users1Service } from '../users1.service';
import { RouterLink } from "@angular/router";
import { Module } from 'ag-grid-community';
import { CrearAvatarService } from '../../../servicios/crear-avatar.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  avatarSvg: SafeHtml | null = null;

  

  constructor(private users1Service: Users1Service, private avatarService: CrearAvatarService,  private sanitizer: DomSanitizer) {}

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

crearAvatar() {
  const seed = 'usuario-' + Math.random().toString(36).substring(2, 8);
  const svg = this.avatarService.generarAvatar(seed);
  this.avatarSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
}



goBack() {
  window.history.back();
}

}
