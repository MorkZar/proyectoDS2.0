
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthoService } from './login/autho.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authoService: AuthoService) {}

  canActivate(): boolean {
    if (this.authoService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}


