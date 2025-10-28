import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthoService } from '../../login/autho.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  userRole: string | null = null;

  constructor(private authService: AuthoService) {}

  currentSection = 'dashboard';

  @Output() sectionChange = new EventEmitter<string>();
  changeSection(section: string) {
    this.sectionChange.emit(section);
  }

  ngOnInit() {
  this.userRole = this.authService.getUserRole();

  if (this.userRole !== 'admin') {
    this.authService.logout();
    window.location.href = '/login';
    alert('No tienes permisos para acceder a esta página');
  }


}
}
