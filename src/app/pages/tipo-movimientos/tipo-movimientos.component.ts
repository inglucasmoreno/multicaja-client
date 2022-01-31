import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TipoMovimientos } from 'src/app/models/tipo-movimientos.model';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { TipoMovimientoService } from '../../services/tipo-movimiento.service';

@Component({
  selector: 'app-tipo-movimientos',
  templateUrl: './tipo-movimientos.component.html',
  styles: [
  ]
})
export class TipoMovimientosComponent implements OnInit {

  public globales = environment;

  // Modal
  public showModal = false;
  public flagEditando = false;
  
  // Tipos
  public idTipo = '';
  public tipos: TipoMovimientos[] = [];
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
    columna: 'descripcion'
  }

  // Modelo reactivo
  public tipoForm = this.fb.group({
    descripcion: ['', Validators.required],
    activo: [true, Validators.required],
  });
  
  constructor(private tipoMovimientosService: TipoMovimientoService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private dataService: DataService) { }
  
  ngOnInit(): void {
    console.log(this.globales.tipo_ingreso_cheque);
    this.dataService.ubicacionActual = "Dashboard - Tipo de movimientos";
    this.listarTipos();
  }
  
  // Listar tipos
  listarTipos(): void {
    this.alertService.loading();
    this.tipoMovimientosService.listarTipos( 
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( ({ tipos, total })=> {
      this.tipos = tipos;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }
  
  // Crear un nuevo tipo
  nuevoTipo(): void {

    const { status } = this.tipoForm;
    const { descripcion } = this.tipoForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    
    this.alertService.loading();  // Comienzo de loading
    
    const data = {
      descripcion: this.tipoForm.value.descripcion,
      activo: this.tipoForm.value.activo
    }
  
    this.tipoMovimientosService.nuevoTipo(data).subscribe(() => {
      this.listarTipos();
      this.reiniciarFormulario();
      this.showModal = false;
    },( ({error}) => {
      this.alertService.errorApi(error.msg);
      return;  
    }));
  
  }
  
  // Tipo por ID
  getTipo(id: string): void {
    this.alertService.loading();
    this.tipoMovimientosService.getTipo(id).subscribe(({ tipo }) => {
      this.idTipo = tipo._id;
      this.tipoForm.setValue({
        descripcion: tipo.descripcion,
        activo: tipo.activo,     
      });
      this.alertService.close();       
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }
  
  // Editar tipo
  editarTipo(id: string): void {
    const { status } = this.tipoForm;
    const { descripcion } = this.tipoForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }

    const data = {
      descripcion: this.tipoForm.value.descripcion,
      activo: this.tipoForm.value.activo
    }
    
    this.alertService.loading();  // Comienzo de loading
    
    this.tipoMovimientosService.actualizarTipo(id, data).subscribe(() => {
      this.listarTipos();
      this.reiniciarFormulario();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }
  
  // Actualizar estado Activo/Inactivo
  actualizarTipos(tipo: any): void {
    
    const verificacion = tipo.descripcion !== 'SIN ESPECIFICAR' && 
                         tipo._id !== this.globales.tipo_cheque &&
                         tipo._id !== this.globales.tipo_ingreso_cheque &&
                         tipo._id !== this.globales.tipo_transferencia_cheque &&
                         tipo._id !== this.globales.tipo_cobro_cheque &&
                         tipo._id !== this.globales.tipo_emision_cheque &&
                         tipo._id !== this.globales.tipo_cheque_emitido_cobrado &&
                         tipo._id !== this.globales.tipo_cheque;
    
    if(verificacion){
      const { _id, activo } = tipo;
      this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
          .then(({isConfirmed}) => {  
            if (isConfirmed) {
              this.alertService.loading();
              this.tipoMovimientosService.actualizarTipo(_id, { activo: !activo }).subscribe(() => {
                this.alertService.loading();
                this.listarTipos();
              }, ({error}) => {
                this.alertService.errorApi(error.msg);
              });
            }
          });
    }else{
      this.alertService.info('Este tipo no se puede dar de baja');
    }


  }
  
  // Reiniciar formulario
  reiniciarFormulario(): void {
  this.tipoForm.setValue({
    descripcion: '',
    activo: true,    
  });    
  };
  
  // Abrir modal
  abrirModal(tipo: string, id: string = null): void {
    window.scrollTo(0,0);
    if(tipo === "crear"){          // Modal: Nuevo tipo
      this.reiniciarFormulario();
      this.flagEditando = false;
    }else{                         // Modal: Editar tipo
      this.getTipo(id);
      this.flagEditando = true;
    }
    this.showModal = true;
  }
  
  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }
  
  // Filtrar por Parametro
  filtrarParametro(parametro: string): void{
  this.paginaActual = 1;
  this.filtro.parametro = parametro;
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
  this.ordenar.columna = columna;
  this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
  this.alertService.loading();
  this.listarTipos();
  }
  

}
