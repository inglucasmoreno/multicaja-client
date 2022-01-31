import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { CuentaContableService } from 'src/app/services/cuenta-contable.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  styles: [
  ]
})
export class CuentasContablesComponent implements OnInit {
  
  // Modal
  public showModal = false;
  public flagEditando = false;
  
  // Tipos
  public idCuentaContable = '';
  public cuentasContables: any[] = [];
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
  public cuentaContableForm = this.fb.group({
    descripcion: ['', Validators.required],
    activo: [true, Validators.required],
  });

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private cuentaContableService: CuentaContableService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Cuentas contables';
    this.listarCuentasContables();
  }

  // Listar cuentras contables
  listarCuentasContables(): void {
    this.alertService.loading();
    this.cuentaContableService.listarCuentasContables( 
      this.ordenar.direccion,
      this.ordenar.columna
      )
    .subscribe( ({ cuentasContables, total })=> {
      this.cuentasContables = cuentasContables;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }

   // Nueva cuenta contable
   nuevaCuenta(): void {
    
    const { status } = this.cuentaContableForm;
    const { descripcion } = this.cuentaContableForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }
    
    this.alertService.loading();  // Comienzo de loading
    
    const data = {
      descripcion: this.cuentaContableForm.value.descripcion,
      activo: this.cuentaContableForm.value.activo
    }
  
    this.cuentaContableService.nuevaCuentaContable(data).subscribe(() => {
      this.listarCuentasContables();
      this.reiniciarFormulario();
      this.showModal = false;
    },( ({error}) => {
      this.alertService.errorApi(error.msg);
      return;  
    }));
    
  }

  // Cuenta contable por ID
  getCuentaContable(id: string): void {
    this.alertService.loading();
    this.cuentaContableService.getCuentaContable(id).subscribe(({ cuentaContable }) => {
      this.idCuentaContable = cuentaContable._id;
      this.cuentaContableForm.setValue({
        descripcion: cuentaContable.descripcion,
        activo: cuentaContable.activo,     
      });
      this.alertService.close();       
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }

  // Editar cuenta contable
  editarCuentaContable(id: string): void {
    const { status } = this.cuentaContableForm;
    const { descripcion } = this.cuentaContableForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === ''){
      this.alertService.formularioInvalido();
      return;
    }

    const data = {
      descripcion: this.cuentaContableForm.value.descripcion,
      activo: this.cuentaContableForm.value.activo
    }
    
    this.alertService.loading();  // Comienzo de loading
    
    this.cuentaContableService.actualizarCuentaContable(id, data).subscribe(() => {
      this.listarCuentasContables();
      this.reiniciarFormulario();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }

  // Actualizar estado Activo/Inactivo
  actualizarCuentaContable(cuenta: any): void {
    if(cuenta.descripcion == 'SIN ESPECIFICAR') return this.alertService.info('Esta cuenta no se puede dar de baja');
    const { _id, activo } = cuenta;
    this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
        .then(({isConfirmed}) => {  
          if (isConfirmed) {
            this.alertService.loading();
            this.cuentaContableService.actualizarCuentaContable(_id, { activo: !activo }).subscribe(() => {
              this.alertService.loading();
              this.listarCuentasContables();
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
      this.getCuentaContable(id);
      this.flagEditando = true;
    }
    this.showModal = true;
  }

  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.cuentaContableForm.setValue({
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
    this.listarCuentasContables();
  }

}
