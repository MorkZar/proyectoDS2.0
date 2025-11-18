import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import DOMPurify from 'dompurify';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { AuthGoogleService } from './auth-google.service';

declare var google: any;


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, HttpClientModule, OAuthModule, ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMsg: string = '';
  successMsg: string = '';

  

  constructor(private http: HttpClient, private router: Router, private authGoogleService: AuthGoogleService) {
  }

  

    ngAfterViewInit() {
    // Esperar a que Google esté disponible
    const interval = setInterval(() => {
      if (typeof google !== "undefined") {
        
        google.accounts.id.initialize({
          client_id: "556523685960-4r808ijgat7sm0v7tkaladf1cnusbdof.apps.googleusercontent.com",
          callback: (response: any) => this.loginGoogle1(response)
        });

        google.accounts.id.renderButton(
          document.getElementById("googleBtn")!,
          { theme: "filled_blue", size: "large", shape: "pill" }
        );

        clearInterval(interval);
      }
    }, 200);
  }

// ----------------------------
  // LOGIN Usuario y Contrasena
  // ----------------------------


  onLogin1() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.correo.trim() || !this.password.trim()) {
      this.errorMsg = 'Completa correo y contraseña.';
      return;
    }

    this.http.post<any>(
      'http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/iniciarsesion.php',
      {
        correo: DOMPurify.sanitize(this.correo),
        password: DOMPurify.sanitize(this.password)
      }
    ).subscribe({
      next: (res) => {
        console.log('Respuesta backend login:', res);

        if (res.success && res.user_id) {
          // Código enviado correctamente
          this.successMsg = 'Se ha enviado un código de verificación a tu celular.';

          // Guardar user_id
          localStorage.setItem('user_id', res.user_id);

          // Redirigir a la pantalla de verificación
          setTimeout(() => {
            this.router.navigate(['/verificacion2fa']);
          }, 500);
        } else {
          this.errorMsg = res.error || 'Error al iniciar sesión.';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error al conectar con el servidor.';
      }
    });
  }

  // ----------------------------
  // LOGIN CON GOOGLE
  // ----------------------------


  loginGoogle1(googleResponse: any) {


  if (!googleResponse || !googleResponse.credential) {
    console.error("ERROR: Google no devolvió token");
    this.errorMsg = "No se pudo obtener el token de Google.";
    return;
  }

  console.log("Token recibido desde Google:", googleResponse.credential);

  this.http.post(
  "http://localhost/xampp/proyectoDS2/proyectoDS2.0/src/Backend/validateGoogle.php",
  { credential: googleResponse.credential },
  { headers: { "Content-Type": "application/json" } }
)
  .subscribe(
    (res: any) => {
      console.log("Respuesta backend:", res);

      if (res.ok) {
        this.authGoogleService.saveGoogleUser(res);
        this.router.navigate(['/home']);
      } else {
        this.errorMsg = "Token inválido o rechazo del backend.";
      }
    },
    err => {
      console.error("Backend error:", err);
      this.errorMsg = "Error al conectar con el servidor.";
    }
  );
}

  // ----------------------------
  // ACTIVAR LISTENER DE GOOGLE
  // ----------------------------
  ngOnInit() {
    window.addEventListener("google-login", (event: any) => {
      this.loginGoogle1(event.detail); 
    });
  }
}