import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Users1Service {

  private API = 'http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/apiUser.php'; 

  constructor(private http: HttpClient) {}

  // Obtener perfil
  getProfile(): Observable<any> {
    return this.http.get(this.API);
  }

  // Actualizar perfil
  updateProfile(data: any): Observable<any> {
    return this.http.put(this.API, data);
  }
}
