import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule, NavigationStart, NavigationEnd, Event} from '@angular/router';
import { AuthoService } from '../../login/autho.service';
import 'spoilerjs/spoiler-span';
import { CommonModule } from '@angular/common';
import { AuthGoogleService } from '../../login/auth-google.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent{
 
  constructor(private router: Router, private authGoogleService: AuthGoogleService, private authoService: AuthoService) {}
     

  userMenuOpen: boolean = false;
  userEmail = "";

  ngOnInit() {
// Primero, intentamos obtener el email del login normal
    const normalEmail = this.authoService.getEmail();
    if (normalEmail) {
      this.userEmail = normalEmail;
    }

    // Si hay usuario de Google, lo sobreescribimos
    const googleUser = this.authGoogleService.getGoogleUser();
    if (googleUser) {
      this.userEmail = googleUser.name;
    }

  
    this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.userMenuOpen = false;
    }
  });
}

toggleUserMenu() {
  this.userMenuOpen = !this.userMenuOpen;
}

  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('google_user');
  localStorage.removeItem('_grecaptcha');
  sessionStorage.clear();
  this.router.navigate(['/login']);
}
}


