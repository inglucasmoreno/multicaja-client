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

  // Modal
  public showModal = false;
  public flagEditando = false;

  // Empresas
  public idEmpresa = '';
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
    cuit: '',
    telefono: '',
    direccion: '',
    activo: [true, Validators.required],
  });

  constructor(private alertService: AlertService,
              private fb: FormBuilder,
              private empresasService: EmpresasService) { }

  ngOnInit(): void {
    this.listarEmpresas();
  }

  // Listar empresas
  listarEmpresas(): void {
    this.empresasService.listarEmpresas( 
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( ({ empresas, total })=> {
      this.empresas = empresas;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

  // Crear nueva empresa
  nuevaEmpresa(): void {

    const { status } = this.empresaForm;
    const { razon_social } = this.empresaForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || razon_social.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }

    this.alertService.loading();  // Comienzo de loading

    this.empresasService.nuevaEmpresa(this.empresaForm.value).subscribe(() => {
      this.listarEmpresas();
      this.reiniciarFormulario();
      this.showModal = false;
    },( ({error}) => {
      this.alertService.errorApi(error.msg);
      return;  
    }));

  }

  // Empresa por ID
  getEmpresa(id: string): void {
    this.alertService.loading();
    this.empresasService.getEmpresa(id).subscribe(({ empresa }) => {
      this.idEmpresa = empresa._id;
      this.empresaForm.setValue({
        razon_social: empresa.razon_social,
        cuit: empresa.cuit,
        telefono: empresa.telefono,
        direccion: empresa.direccion,
        activo: empresa.activo,     
      });
      this.alertService.close();       
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }

  // Editar empresa
  editarEmpresa(id: string): void {
    const { status } = this.empresaForm;
    const { razon_social } = this.empresaForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || razon_social.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }

    this.alertService.loading();  // Comienzo de loading

    this.empresasService.actualizarEmpresa(id, this.empresaForm.value).subscribe(() => {
      this.listarEmpresas();
      this.reiniciarFormulario();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(empresa: any): void {
  const { _id, activo } = empresa;
    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.empresasService.actualizarEmpresa(_id, { activo: !activo }).subscribe(() => {
              this.alertService.loading();
              this.listarEmpresas();
            }, ({error}) => {
              this.alertService.errorApi(error.msg);
            });
          }
        });
  }
  
  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.empresaForm.setValue({
      razon_social: '',
      cuit: '',
      telefono: '',
      direccion: '',
      activo: true,     
    })    
  }

  // Abrir modal
  abrirModal(tipo: string, id: string = null): void {
    if(tipo === "crear"){          // Modal: Nueva empresa
      this.reiniciarFormulario();
      this.flagEditando = false;
    }else{                         // Modal: Editar empresa
      this.getEmpresa(id);
      this.flagEditando = true;
    }
    this.showModal = true;
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
