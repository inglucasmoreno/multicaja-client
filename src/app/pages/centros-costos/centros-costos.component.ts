import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from '../../services/data.service';
import { CentroCostosService } from '../../services/centro-costos.service';

@Component({
  selector: 'app-centros-costos',
  templateUrl: './centros-costos.component.html',
  styles: [
  ]
})
export class CentrosCostosComponent implements OnInit {

  // Modal
  public showModal = false;
  public flagEditando = false;
  
  // Tipos
  public idCentroCosto = '';
  public centrosCostos: any[] = [];
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
  public centroCostosForm = this.fb.group({
    descripcion: ['', Validators.required],
    activo: [true, Validators.required],
  });

  constructor(private dataService: DataService,
              private fb: FormBuilder,
              private alertService: AlertService,
              private centroCostosServices: CentroCostosService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Centros de costos';
    this.listarCentros();
  }

  // Listar centros de costos
  listarCentros(): void {
    this.alertService.loading();
    this.centroCostosServices.listarCentrosCostos( 
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( ({ centros, total })=> {
      this.centrosCostos = centros;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Nuevo centro
  nuevoCentro(): void {
  
    const { status } = this.centroCostosForm;
    const { descripcion } = this.centroCostosForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    
    this.alertService.loading();  // Comienzo de loading
    
    const data = {
      descripcion: this.centroCostosForm.value.descripcion,
      activo: this.centroCostosForm.value.activo
    }
  
    this.centroCostosServices.nuevoCentroCostos(data).subscribe(() => {
      this.listarCentros();
      this.reiniciarFormulario();
      this.showModal = false;
    },( ({error}) => {
      this.alertService.errorApi(error.msg);
      return;  
    }));
    
  }

  // Centro de costo por ID
  getCentroCosto(id: string): void {
    this.alertService.loading();
    this.centroCostosServices.getCentroCosto(id).subscribe(({ centro }) => {
      this.idCentroCosto = centro._id;
      this.centroCostosForm.setValue({
        descripcion: centro.descripcion,
        activo: centro.activo,     
      });
      this.alertService.close();       
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }

  // Editar centro costo
  editarCentroCosto(id: string): void {
    const { status } = this.centroCostosForm;
    const { descripcion } = this.centroCostosForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }

    const data = {
      descripcion: this.centroCostosForm.value.descripcion,
      activo: this.centroCostosForm.value.activo
    }
    
    this.alertService.loading();  // Comienzo de loading
    
    this.centroCostosServices.actualizarCentroCostos(id, data).subscribe(() => {
      this.listarCentros();
      this.reiniciarFormulario();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarCentroCosto(centro: any): void {
    if(centro.descripcion == 'SIN ESPECIFICAR') return this.alertService.info('Este centro no puede ser dado de baja');
    const { _id, activo } = centro;
    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.centroCostosServices.actualizarCentroCostos(_id, { activo: !activo }).subscribe(() => {
              this.alertService.loading();
              this.listarCentros();
            }, ({error}) => {
              this.alertService.errorApi(error.msg);
            });
          }
        });
  }

  // Abrir modal
  abrirModal(tipo: string, id: string = null): void {
    window.scrollTo(0,0);
    if(tipo === "crear"){          // Modal: Nuevo tipo
      this.reiniciarFormulario();
      this.flagEditando = false;
    }else{                         // Modal: Editar tipo
      this.getCentroCosto(id);
      this.flagEditando = true;
    }
    this.showModal = true;
  }

  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.centroCostosForm.setValue({
      descripcion: '',
      activo: true,    
    });    
  };

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
    this.listarCentros();
  }


}
