import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { DataService } from 'src/app/services/data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AlertService } from '../../../services/alert.service';

import gsap from 'gsap';

@Component({
  selector: 'app-editar-password',
  templateUrl: './editar-password.component.html',
  styles: [
  ]
})
export class EditarPasswordComponent implements OnInit {

  public id: string;
  public loading = true;
  public usuario: Usuario = {
    uid: '',
    usuario: '',
    apellido: '',
    dni: '',
    nombre: '',
    email: '',
    role: ''
  };
  public passwordForm = this.fb.group({
    password: ['', Validators.required],
    repetir: ['', Validators.required]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private usuariosService: UsuariosService,
              private alertService: AlertService,
              private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios - Actualizando contraseña';
    gsap.from(".gsap-contenido", { duration: 0.2, y: 100, opacity: 0.2 });
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({id}) => {
      this.id = id;
      this.usuariosService.getUsuario(id).subscribe( usuario => {
        this.usuario = usuario;
        this.alertService.close();
      });
    });
  }
    
  // Actualizar constraseña
  actualizarPassword(): void | boolean{
    const {password, repetir} = this.passwordForm.value;
    
    // Verificacion - Falta de datos
    if (password.trim() === '' || repetir.trim() === ''){
      this.alertService.formularioInvalido();
      return false;
    }

    // Verificacion - Coincidencia de contraseñas
    if (password !== repetir){
      this.alertService.info('Las contraseñas deben coincidir');
      return false;
    }
    
    this.alertService.loading();
    this.usuario.password = password;
    this.usuariosService.actualizarUsuario(this.id, this.usuario).subscribe(() => {
      this.alertService.close();
      this.router.navigateByUrl('/dashboard/usuarios');
    }, ({error}) => {
      this.alertService.errorApi(error.msg);
    });
  }
  
}
