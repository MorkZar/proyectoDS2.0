import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// Import default
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthoService {

  private readonly TOKEN_KEY = 'token'; 

  constructor(private router: Router) { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('google_user');

  // Limpia todo lo que tu app haya guardado
    sessionStorage.clear();
  this.router.navigate(['/login']);
  }

  
  
    decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return (jwtDecode as any)(token); 
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

 getUserRole(): string | null {
  const decoded: any = this.decodeToken();
  //buscam dentro de data
  return decoded?.data?.rol || null;
}

getEmail(): string | null {
  const decoded: any = this.decodeToken();
  return decoded?.data?.correo || null;
}

getUserId(): string | null {
  const decoded: any = this.decodeToken();
  return decoded?.data?.id || null;
}

}
