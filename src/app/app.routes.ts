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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'create-user', component: CreateUserComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'verificacion2fa', component: Verificacion2faComponent},
  {path: 'dashboard-administracion', component: DashboardAdministracionComponent},
  {path: 'listusers', component: ListusersComponent},
  { path: '**', component: NotFoundComponent },
];

