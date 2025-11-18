import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {

  private googleKey = 'google_user';

  constructor() {}

  // Guarda los datos del login exitoso
  saveGoogleUser(user: any) {
    localStorage.setItem(this.googleKey, JSON.stringify(user));
  }

  // Comprueba si el usuario está autenticado
  isAuthenticatedGoogle(): boolean {
    return localStorage.getItem(this.googleKey) !== null;
  }

  // Obtener datos
  getGoogleUser() {
    const data = localStorage.getItem(this.googleKey);
    return data ? JSON.parse(data) : null;
  }

  logoutGoogle() {
    localStorage.removeItem(this.googleKey);
  }
}

