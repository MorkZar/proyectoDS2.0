import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <button (click)="goBack()" class="btn">Volver</button>
    </div>
  `,
  styles: [`
    .not-found { text-align: center; margin-top: 50px; font-family: Arial, sans-serif; }
    h1 { font-size: 80px; color: #e74c3c; }
    p { font-size: 20px; margin-bottom: 20px; }
    .btn {
      padding: 10px 20px;
      background-color: #3498db;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: background-color 0.3s;
    }
    .btn:hover { background-color: #2980b9; }
  `]
})
export class NotFoundComponent {
  constructor(private location: Location, private router: Router) {}

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // fallback si no hay historial
      this.router.navigate(['/login']);
    }
  }
}


