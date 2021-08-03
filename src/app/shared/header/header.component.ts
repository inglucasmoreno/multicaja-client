import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  // Dropdown
  public showUsuarios = false;

  public showMenu = true;
  public openAdmin = true;

  constructor( public authService: AuthService ) { }

  ngOnInit(): void {
  }

  // Metodo: Cerrar sesion
  logout(): void{
    this.authService.logout();
  }

  // Metodo
  toggleMenu(): void{
    this.showMenu ? this.showMenu = false : this.showMenu = true;
  }

}
