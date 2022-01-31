import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

import { UsuariosService } from 'src/app/services/usuarios.service';
import { AlertService } from '../../services/alert.service';

import gsap from 'gsap';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styles: [
  ]
})
export class NuevoUsuarioComponent implements OnInit {

  public loading = false;
  
  // Modelo reactivo
  public usuarioForm = this.fb.group({
    usuario: ['', Validators.required],
    apellido: ['', Validators.required],
    nombre: ['', Validators.required],
    dni: ['', Validators.required],
    email: [''],
    password: ['', Validators.required],
    repetir: ['', Validators.required],
    role: ['ADMIN_ROLE', Validators.required],
    activo: ['true', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private usuariosService: UsuariosService,
              private alertService: AlertService,
              private dataService: DataService
              ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Usuarios - Creando';
    gsap.from(".gsap-contenido", { duration: 0.2, y: 100, opacity: 0.2 });
  }
  
  // Crear nuevo usuario
  nuevoUsuario(): void {

    const { status } = this.usuarioForm;
    const {usuario, apellido, nombre, dni, password, repetir} = this.usuarioForm.value;
    
    // Se verifica que los campos no tengan un espacio vacio
    const campoVacio = usuario.trim() === '' || 
                       apellido.trim() === '' || 
                       nombre.trim() === '' ||
                       dni.trim() === '' ||
                       password.trim() === '' ||
                       repetir.trim() === '';

    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || campoVacio){
      this.alertService.formularioInvalido();
      return;
    }

    // Se verifica si las contraseñas coinciden
    if(password !== repetir){
      this.alertService.info('Las contraseñas deben coincidir');
      return;   
    }

    this.alertService.loading();  // Comienzo de loading

    // Se crear el nuevo usuario
    this.usuariosService.nuevoUsuario(this.usuarioForm.value).subscribe(() => {
      this.alertService.close();  // Finaliza el loading
      this.router.navigateByUrl('dashboard/usuarios');
    },( ({error}) => {
      this.alertService.close();  // Finaliza el loading
      this.alertService.errorApi(error.msg);
      return;  
    }));

  }

}
