import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './admin.guard';
import { NotFoundComponent } from './pages/notFoundComponent';
import { Verificacion2faComponent } from './verificacion2fa/verificacion2fa.component';
import { DashboardAdministracionComponent } from './pages/dashboard-administracion/dashboard-administracion.component';
import { ListusersComponent } from './pages/admin/list/listusers/listusers.component';
import { PorfileComponent } from './pages/porfile/porfile.component';
import { DatosuserComponent } from './pages/porfile/datosuser/datosuser.component';
import { CambiarContrasenaComponent } from './pages/porfile/cambiar-contrasena/cambiar-contrasena.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'create-user', component: CreateUserComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'verificacion2fa', component: Verificacion2faComponent},
  {
    path: 'dashboard-administracion',
    component: DashboardAdministracionComponent, canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: 'admin', component: AdminComponent , canActivate: [AdminGuard]},
      { path: 'listusers', component: ListusersComponent, canActivate: [AdminGuard]},

      // Ruta por defecto si no se escribe nada
      { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  },
  {path: 'porfile', component: PorfileComponent, canActivate: [AuthGuard]},
  {path: 'datosuser', component: DatosuserComponent, canActivate: [AuthGuard]},
  {path: 'cambiarContrasena', component: CambiarContrasenaComponent, canActivate: [AuthGuard]},
  { path: '**', component: NotFoundComponent },
];

//canActivate: [AdminGuard]},