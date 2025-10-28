import { Component } from '@angular/core';
import { Router, RouterModule, NavigationStart} from '@angular/router';
import { AuthoService } from '../../login/autho.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{
 
  constructor(private router: Router, private authoService: AuthoService) {}
     


  logout() {
  this.router.navigate(['/login']);
}
}


