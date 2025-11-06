import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// Import default
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthoService {

  private readonly TOKEN_KEY = 'token'; 

  constructor() { }

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
    localStorage.removeItem(this.TOKEN_KEY);
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

}



