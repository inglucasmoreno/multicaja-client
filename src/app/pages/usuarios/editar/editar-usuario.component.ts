import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { Usuario } from '../../../models/usuario.model';
import { UsuariosService } from '../../../services/usuarios.service';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styles: [
  ]
})
export class EditarUsuarioComponent implements OnInit {

  public id: string;
  public usuario: Usuario;
  public usuarioForm = this.fb.group({
    usuario: ['', Validators.required],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    email: ['', Validators.email],
    role: ['USER_ROLE', Validators.required],
    activo: ['true', Validators.required],
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService,
              private alertService: AlertService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios - Editando'
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({id}) => { this.id = id; });
    this.usuariosService.getUsuario(this.id).subscribe(usuarioRes => {
      this.usuario = usuarioRes;
      const {usuario, apellido, nombre, email, role, activo} = this.usuario;
      this.usuarioForm.setValue({
        usuario,
        apellido,
        nombre,
        email,
        role,
        activo: String(activo)
      });
      this.alertService.close();
    });
  }

  // Editar usuario
  editarUsuario(): void | boolean{
      
    const {usuario, apellido, nombre, email} = this.usuarioForm.value;

    // Se verifica que los campos no tengan un espacio vacio
    const campoVacio = usuario.trim() === '' || 
                       apellido.trim() === '' || 
                       email.trim() === '' || 
                       nombre.trim() === '';

    // Se verifica que todos los campos esten rellenos
    if (this.usuarioForm.status === 'INVALID' || campoVacio){
      this.alertService.formularioInvalido()
      return false;
    }

    this.alertService.loading();

    this.usuariosService.actualizarUsuario(this.id, this.usuarioForm.value).subscribe(() => {
      this.alertService.close();
      this.router.navigateByUrl('dashboard/usuarios');
    }, ({error}) => {
      this.alertService.close();
      this.alertService.errorApi(error.msg);
    });

  }

  regresar(): void{
    this.router.navigateByUrl('/dashboard/usuarios');
  }

}
