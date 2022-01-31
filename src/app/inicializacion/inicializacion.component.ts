import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-inicializacion',
  templateUrl: './inicializacion.component.html',
  styles: [
  ]
})
export class InicializacionComponent implements OnInit {

  constructor(
              private usuariosService: UsuariosService,
              private alertService: AlertService) { }

  ngOnInit(): void {}
  
  // Inicializacion de usuarios
  inicializarUsuarios(): void {
    this.alertService.loading();
    this.usuariosService.inicializarUsuario().subscribe(({message}) => {
      this.alertService.success(message);
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

}
