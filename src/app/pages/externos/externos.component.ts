import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ExternosService } from '../../services/externos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Externo } from '../../models/externos.model';

@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styles: [
  ]
})
export class ExternosComponent implements OnInit {

  // Modal
  public showModal = false;
  public flagEditando = false;
  
  // Externos
  public idExterno = '';
  public externos: Externo[] = [];
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
  public externoForm = this.fb.group({
    descripcion: ['', Validators.required],
    dni_cuit: '',
    telefono: '',
    direccion: '',
    activo: [true, Validators.required],
  });
  
  constructor(private externosService: ExternosService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private dataService: DataService) { }
  
  ngOnInit(): void {
    this.alertService.loading();
    this.dataService.ubicacionActual = "Dashboard - Externos";
    this.listarExternos();
  }
  
  // Listar externos
  listarExternos(): void {
    this.externosService.listarExternos( 
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( ({ externos, total })=> {
      this.externos = externos;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }
  
  // Crear un nuevo externo
  nuevoExterno(): void {
  
  const { status } = this.externoForm;
  const { descripcion } = this.externoForm.value;
  
  // Se verifica si los campos son invalidos
  if(status === 'INVALID' || descripcion.trim() === ''){
    this.alertService.formularioInvalido();
    return;
  }
  
  this.alertService.loading();  // Comienzo de loading
  
  this.externosService.nuevoExterno(this.externoForm.value).subscribe(() => {
    this.listarExternos();
    this.reiniciarFormulario();
    this.showModal = false;
  },( ({error}) => {
    this.alertService.errorApi(error.msg);
    return;  
  }));
  
  }
  
  // Externo por ID
  getExterno(id: string): void {
    this.alertService.loading();
    this.externosService.getExterno(id).subscribe(({ externo }) => {
      this.idExterno = externo._id;
      this.externoForm.setValue({
        descripcion: externo.descripcion,
        dni_cuit: externo.dni_cuit,
        telefono: externo.telefono,
        direccion: externo.direccion,
        activo: externo.activo,     
      });
      this.alertService.close();       
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }
  
  // Editar externo
  editarExterno(id: string): void {
    const { status } = this.externoForm;
    const { descripcion } = this.externoForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
  }
  
  this.alertService.loading();  // Comienzo de loading
  
  this.externosService.actualizarExterno(id, this.externoForm.value).subscribe(() => {
    this.listarExternos();
    this.reiniciarFormulario();
    this.showModal = false;
  },({error})=>{
    this.alertService.errorApi(error.msg);
  });
  }
  
  // Actualizar estado Activo/Inactivo
  actualizarExterno(externo: any): void {
    const { _id, activo } = externo;
    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.externosService.actualizarExterno(_id, { activo: !activo }).subscribe(() => {
              this.alertService.loading();
              this.listarExternos();
            }, ({error}) => {
              this.alertService.errorApi(error.msg);
            });
          }
        });
  }
  
  // Reiniciar formulario
  reiniciarFormulario(): void {
  this.externoForm.setValue({
    descripcion: '',
    dni_cuit: '',
    telefono: '',
    direccion: '',
    activo: true,    
  });    
  };
  
  // Abrir modal
  abrirModal(tipo: string, id: string = null): void {
  if(tipo === "crear"){          // Modal: Nuevo externo
    this.reiniciarFormulario();
    this.flagEditando = false;
  }else{                         // Modal: Editar externo
    this.getExterno(id);
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
    this.listarExternos();
  }
  

}
