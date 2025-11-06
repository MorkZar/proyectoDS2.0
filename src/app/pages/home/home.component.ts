import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule, NavigationStart} from '@angular/router';
import { AuthoService } from '../../login/autho.service';
import 'spoilerjs/spoiler-span';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent{
 
  constructor(private router: Router, private authoService: AuthoService) {}
     


  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  sessionStorage.clear();
  this.router.navigate(['/login']);
}
}



