import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard-administracion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-administracion.component.html',
  styleUrl: './dashboard-administracion.component.css'
})
export class DashboardAdministracionComponent {

  constructor(private elementRef: ElementRef) {}

ngAfterViewInit(): void {
    const toggle = this.elementRef.nativeElement.querySelector('.toggle') as HTMLElement;
    const menuDashboard = this.elementRef.nativeElement.querySelector('.menu-dashboard') as HTMLElement;
    const iconoMenu = toggle.querySelector('i') as HTMLElement;
    const enlacesMenu = this.elementRef.nativeElement.querySelectorAll('.enlace');

    // Evento para abrir/cerrar menú
    toggle.addEventListener('click', () => {
      menuDashboard.classList.toggle('open');

      if (iconoMenu.classList.contains('bx-menu')) {
        iconoMenu.classList.replace('bx-menu', 'bx-x');
      } else {
        iconoMenu.classList.replace('bx-x', 'bx-menu');
      }
    });

    // Evento para los enlaces
    enlacesMenu.forEach((enlace: Element) => {
      enlace.addEventListener('click', () => {
        menuDashboard.classList.add('open');
        iconoMenu.classList.replace('bx-menu', 'bx-x');
      });
    });
  }
}