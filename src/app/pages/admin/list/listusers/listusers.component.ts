import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './users.service';
import { FormsModule } from '@angular/forms';

// Registrar módulos
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-listusers',
  standalone: true,
  imports: [AgGridAngular, HttpClientModule, FormsModule],
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.css']
})
export class ListusersComponent {

 
  colDef: ColDef[] = [
    { field: 'user_id'},
    { field: 'user_name'},
    { field: 'email'},
    {field: 'phone'},
    {field: 'password'},
    { field: 'rol'},
    { field: 'status'}
  ];

  rowData: any[] = [];
  // variables del formulario
  user_id1: any;
  user_name1: string = '';
  email1: string = '';
  phone1: string = '';
  password1: string = '';
  rol1: string = '';
  status1: string = '';
 
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.rowData = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });

  }

  onRowClicked(event: any) {
  const data = event.data;
  this.user_id1 = data.user_id;
  this.user_name1 = data.user_name;
  this.email1 = data.email;
  this.phone1 = data.phone;
  this.password1 = data.password;
  this.rol1 = data.rol;
  this.status1 = data.status;
}

// limpiar formulario
clearForm() {
  this.user_id1 = '';
  this.user_name1 = '';
  this.email1 = '';
  this.phone1 = '';
  this.password1 = '';
  this.rol1 = '';
  this.status1 = '';
}

  onUpdate() {
  }
  }
