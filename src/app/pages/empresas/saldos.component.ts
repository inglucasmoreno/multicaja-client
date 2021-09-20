import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styles: [
  ]
})
export class SaldosComponent implements OnInit {

  // Empresa
  public empresa: any;

  // Modal
  public showModal = false;
  public flagEditando = false;
  
  // Saldo
  public saldoId = '';
  public saldos: any[] = [];
  public total = 0;
  
  public empresaId = '';

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
  public saldoForm = this.fb.group({
    descripcion: ['', Validators.required],
    monto: null,
    activo: [true, Validators.required],
  });
  
  constructor(private alertService: AlertService,
              private dataService: DataService,
              public authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private empresasService: EmpresasService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Empresas - Saldos";
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.empresaId = id; 
      this.getEmpresa(id);  
      this.listarSaldos();
    });
  }

  // Obtener datos de empresa
  getEmpresa(id: string): void {
    this.empresasService.getEmpresa(id).subscribe(({ empresa }) => {
      this.empresa = empresa;
    });
  }

  // Listar saldos
  listarSaldos(): void {
    this.empresasService.listarSaldos( 
      this.ordenar.direccion,
      this.ordenar.columna,
      this.empresaId
      )
    .subscribe( ({ saldos, total })=> {
      this.saldos = saldos;
      this.total = total;
      this.alertService.close();
    }, (({error}) => {
      this.alertService.errorApi(error.msg);
    }));
  }
  
  // Crear nuevo saldo
  nuevoSaldo(): void {
  
    const { status } = this.saldoForm;
    const { descripcion, monto } = this.saldoForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === '' || monto < 0 || monto === null){
      this.alertService.formularioInvalido();
      return;
    }
  
    this.alertService.loading();  // Comienzo de loading
  
    const data = this.saldoForm.value;
    data.empresa = this.empresaId;

    this.empresasService.nuevoSaldo(this.saldoForm.value).subscribe(() => {
      this.listarSaldos();
      this.reiniciarFormulario();
      this.showModal = false;
    },( ({error}) => {
      this.alertService.errorApi(error.msg);
      return;  
    }));
  
  }
  
  // Saldo por ID
  getSaldo(id: string): void {
    this.alertService.loading();
    this.empresasService.getSaldo(id).subscribe(({ saldo }) => {
      this.saldoId = saldo._id;
      this.saldoForm.setValue({
        descripcion: saldo.descripcion,
        monto: saldo.monto,
        activo: saldo.activo,     
      });
      this.alertService.close();       
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });  
  }
  
  // Editar saldo
  editarSaldo(id: string): void {
    const { status } = this.saldoForm;
    const { descripcion, monto } = this.saldoForm.value;
    
    // Se verifica si los campos son invalidos
    if(status === 'INVALID' || descripcion.trim() === '' || monto < 0 || monto === null){
      this.alertService.formularioInvalido();
      return;
    }
  
    this.alertService.loading();  // Comienzo de loading
  
    this.empresasService.actualizarSaldo(id, this.saldoForm.value).subscribe(() => {
      this.listarSaldos();
      this.reiniciarFormulario();
      this.showModal = false;
    },({error})=>{
      this.alertService.errorApi(error.msg);
    });
  }
  
  // Actualizar estado Activo/Inactivo
  actualizarSaldo(saldo: any): void {
    if(this.authService.usuario.role == 'ADMIN_ROLE'){
      const { _id, activo } = saldo;
        this.alertService.question({ msg: '¿Quieres actualizar el estado?', buttonText: 'Actualizar' })
            .then(({isConfirmed}) => {  
              if (isConfirmed) {
                this.alertService.loading();
                this.empresasService.actualizarSaldo(_id, { activo: !activo }).subscribe(() => {
                  this.alertService.loading();
                  this.listarSaldos();
                }, ({error}) => {
                  this.alertService.errorApi(error.msg);
                });
              }
            });
    }else{
      this.alertService.info('Usuario sin autorización');
    }
  }
  
  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.saldoForm.setValue({
      descripcion: '',
      monto: null,
      activo: true,     
    })    
  }
  
  // Abrir modal
  abrirModal(tipo: string, id: string = null): void {
    window.scrollTo(0,0);
    if(tipo === "crear"){          // Modal: Nuevo saldo
      this.reiniciarFormulario();
      this.flagEditando = false;
    }else{                         // Modal: Editar saldo
      this.getSaldo(id);
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
    this.listarSaldos();
  } 
  
}
