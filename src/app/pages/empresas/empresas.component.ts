import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styles: [
  ]
})
export class EmpresasComponent implements OnInit {

  public showModalCreacion = false;
  public showModalEdicion = true;

  // Empresas
  public empresas: any[] = [];
  public total = 0;

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  // Modelo reactivo
  public empresaForm = this.fb.group({
    razon_social: ['', Validators.required],
    cuit: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    activo: [true, Validators.required],
  });

  constructor(private alertService: AlertService,
              private fb: FormBuilder,
              private empresasService: EmpresasService) { }

  ngOnInit(): void {
    this.listarEmpresas();
  }

  // Listar usuarios
  listarEmpresas(): void {
    this.empresasService.listarEmpresas( 
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( resp => {
      const { empresas, total } = resp;
      this.empresas = empresas;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.close();
      this.alertService.errorApi(error.msg);
    }));
  }

   // Actualizar estado Activo/Inactivo
   actualizarEstado(empresa: any): void {
    // const { uid, activo } = empresa;
    //   this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
    //       .then(({isConfirmed}) => {  
    //         if (isConfirmed) {
    //           this.alertService.loading();
    //           this.usuariosService.actualizarUsuario(uid, {activo: !activo}).subscribe(() => {
    //             this.alertService.loading();
    //             this.listarUsuarios();
    //           }, ({error}) => {
    //             this.alertService.close();
    //             this.alertService.errorApi(error.msg);
    //           });
    //         }
    //       });
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.filtro.activo = activo;
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void{
    this.filtro.parametro = parametro;
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.alertService.loading();
    this.listarEmpresas();
  }

}
