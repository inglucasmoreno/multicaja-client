import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { MovimientosService } from '../../services/movimientos.service';
import { ExternosService } from '../../services/externos.service';
import { EmpresasService } from '../../services/empresas.service';
import { TipoMovimientos } from '../../models/tipo-movimientos.model';
import { TipoMovimientoService } from 'src/app/services/tipo-movimiento.service';
import { ChequesService } from '../../services/cheques.service';
import { environment } from '../../../environments/environment';
import { CentroCostosService } from '../../services/centro-costos.service';
import { CuentaContableService } from 'src/app/services/cuenta-contable.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styles: [
  ]
})
export class MovimientosComponent implements OnInit {

  // Inicializando SIN ESPECIFICAR
  public tipo_inicial = '';
  public centro_inicial = '';
  public cuenta_inicial = '';

  // Modal
  public showModal = false;
  public showModalCheque = false;
  public showModalDetalles = false;
  public flagEditando = false;
  
  // Flag
  public showDatosCheque = false;
  public showDatosMovimiento = true;

  // Tipos especiales
  public tipoCheque = environment.tipo_cheque;

  // Movimientos
  public idMovimiento = '';
  public movimientoSeleccionado: any = null;
  public movimientos: any[] = [];
  public total = 0;
  public mostrarCheque:any = {};

  // Centros de costos
  public centrosCostos: any[] = [];

  // Cuenta contable
  public cuentasContables: any[] = [];

  // Externos
  public externos: any[] = [];

  // Empresas
  public empresas: any[] = [];

  // Tipos de movimientos
  public tipos: TipoMovimientos[] = [];

  // Elementos origen
  public elementosOrigen: any[] = [];

  // Elemento destino
  public elementosDestino: any[] = [];

  // Saldos
  public saldos_origen: any [] = [];
  public saldos_destino: any[] = [];

  // Reinicio de SIN ESPECIFICAR


  // Data
  public data = {
    cheque: null,
    descripcion: 'Testing',
    tipo_origen: 'Externo',
    tipo_destino: 'Externo',
    centro_costos: '',
    cuenta_contable: '',
    comprobante: '',
    concepto: '',
    origen: '',
    destino: '',
    tipo_movimiento: '',
    origen_saldo: '',
    destino_saldo: '',
    monto: null
  }
  
  // cheque
  public cheque = {
    nro_cheque: '',
    concepto: '',
    cliente_descripcion: '',
    cliente: '',
    destino_descripcion: '',
    destino: '',
    emisor: '',
    cuit: '',
    importe: 0
  }

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
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }
  
  // Modelo reactivo
  public movimientoForm = this.fb.group({
    descripcion: ['', Validators.required],
    dni_cuit: '',
    telefono: '',
    direccion: '',
    activo: [true, Validators.required],
  });
  
  constructor(private movimientosService: MovimientosService,
              private tipoMovimientosService: TipoMovimientoService,
              private chequesService: ChequesService,
              private externosService: ExternosService,
              private empresasService: EmpresasService,
              private alertService: AlertService,
              private dataService: DataService,
              private centroCostosService: CentroCostosService,
              private cuentaContableService: CuentaContableService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Movimientos";

    this.alertService.loading();

    this.movimientosService.listarMovimientos( // LISTADO DE MOVIMIENTOS
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({ movimientos, total }) => {
      this.movimientos = movimientos;
      this.total = total;
      
      this.externosService.listarExternos().subscribe(({ externos }) => {                                  // LISTADO DE EXTERNOS
        this.externos = externos.filter( externo => (externo.activo == true) );
        this.elementosOrigen = this.externos;
        this.elementosDestino = this.externos;
            
          this.empresasService.listarEmpresas().subscribe(({ empresas })=> {                               // LISTADO DE EMPRESAS
            this.empresas = empresas.filter( empresa => (empresa.activo == true) );
            
            this.centroCostosService.listarCentrosCostos().subscribe(({ centros, centro_sin_especificar })=>{                      // LISTADO DE CENTROS DE COSTOS
              this.centrosCostos = centros.filter( centro => (centro.activo == true));
              this.centro_inicial = centro_sin_especificar._id;

              this.cuentaContableService.listarCuentasContables().subscribe(({cuentasContables , cuenta_sin_especificar})=>{        // LISTADO DE CUENTAS CONTABLES
                this.cuentasContables = cuentasContables.filter( cuenta => (cuenta.activo == true) );
                this.cuenta_inicial = cuenta_sin_especificar._id;
              
                this.tipoMovimientosService.listarTipos().subscribe( ({ tipos, tipo_sin_especificar }) => {                      // LISTADO DE TIPOS
                  this.tipos= tipos.filter( tipo => (tipo.activo && 
                                                     tipo._id !== environment.tipo_cheque &&
                                                     tipo._id !== environment.tipo_ingreso_cheque &&
                                                     tipo._id !== environment.tipo_transferencia_cheque &&
                                                     tipo._id !== environment.tipo_cobro_cheque &&
                                                     tipo._id !== environment.tipo_cheque_emitido_cobrado &&
                                                     tipo._id !== environment.tipo_emision_cheque));
                  
                  this.tipo_inicial = tipo_sin_especificar._id;

                  this.alertService.close();   
                }, ({error})=>{
                  this.alertService.errorApi(error); // ERROR: LISTOS  
                });
                     
              },({error})=>{
                this.alertService.errorApi(error);  // ERROR: CUENTAS CONTABLES
              });
            },({error})=>{
              this.alertService.errorApi(error);    // EROOR: CENTROS DE COSTOS
            });
            
          },({error})=>{
            this.alertService.errorApi(error);      // ERROR: EMPRESAS
          });
      
      },({error})=>{
        this.alertService.errorApi(error);          // ERROR: EXTERNOS
      });  
    }, ({ error }) => {
      this.alertService.errorApi(error);            // ERROR: MOVIMIENTOS
    });

  }
  
  // Actualizar selectores
  actualizarTipo(origen_destino: string, tipo: string ): void {
    if(origen_destino === 'Origen'){  // Origen
      this.data.origen = '';
      this.data.origen_saldo = '';
      if(tipo == 'Interno'){          // Origen - Interno
        this.elementosOrigen = this.empresas;
      }else{                          // Origen - Externo
        this.elementosOrigen = this.externos;
      }
    }else{                            // Destino
      this.data.destino = '';
      this.data.destino_saldo = '';
      if(tipo == 'Interno'){          // Destino - Interno
        this.elementosDestino = this.empresas;
      }else{                          // Destino - Externo
        this.elementosDestino = this.externos;
      }
    }
  }

  // Actualizacion de saldos
  actualizarElemento(origen_destino: string, id: string, otro: any){
    if(id !== ''){
      
      if(origen_destino === 'Origen') this.cheque.cliente_descripcion = otro[otro.selectedIndex].text;
      else this.cheque.destino_descripcion = otro[otro.selectedIndex].text;

      if(this.data.tipo_origen === 'Interno' && origen_destino === 'Origen' || this.data.tipo_destino === 'Interno' && origen_destino === 'Destino'){
        this.alertService.loading();
        this.empresasService.listarSaldos(1,'descripcion',id).subscribe(({ saldos }) => {
          if(origen_destino === 'Origen'){  // Origen         
            this.data.origen_saldo = '';
            this.saldos_origen = saldos.filter( saldo => (saldo.activo == true && saldo.descripcion !== 'CHEQUES') ); 
          }else{                            // Destino
            this.data.destino_saldo = '';
            this.saldos_destino = saldos.filter( saldo => (saldo.activo == true && saldo.descripcion !== 'CHEQUES') ); 
          }
          this.alertService.close();
        })
      }
    }    
  }

  // Listado de movimientos
  listarMovimientos(): void {
    this.alertService.loading();
    this.movimientosService.listarMovimientos(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({ movimientos, total }) => {
      console.log(movimientos);
      this.movimientos = movimientos;
      this.total = total;
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error);  
    });
  }


  // Crear movimiento
  crearMovimiento(): void {
    const verificacion = this.data.monto === null || 
                         this.data.monto < 0 ||
                         this.data.origen.trim() === '' ||
                         this.data.destino.trim() === '' ||
                         this.data.tipo_origen === 'Interno' && this.data.origen_saldo === '' ||
                         this.data.tipo_destino === 'Interno' && this.data.destino_saldo === ''

    if(verificacion) return this.alertService.formularioInvalido();
    
    this.alertService.question({ msg: '¿Estas por crear un movimiento?', buttonText: 'Crear' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        if(this.data.tipo_movimiento === this.tipoCheque){ // Abrir modal - CHEQUE
          this.cheque.cliente = this.data.origen;
          this.cheque.destino = this.data.destino;
          this.cheque.importe = this.data.monto;
          this.showModal = false;
          this.showModalCheque = true;
        }else{ // Crear nuevo movimiento
          this.nuevoMovimiento();
        }
      }
    });
  }

  // Nuevo movimiento
  nuevoMovimiento(): void {
    this.alertService.loading();
    this.movimientosService.nuevoMovimiento(this.data).subscribe(()=>{
      this.listarMovimientos();
      this.reiniciarFormulario();
      this.showModal = false;
      this.showModalCheque = false;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });  
  }
    
  // Reiniciar formulario
  reiniciarFormulario(): void {
    
    this.data = {
      cheque: null,
      descripcion: 'Testing',
      monto: null,
      centro_costos: '',
      cuenta_contable: '',
      comprobante: '',
      concepto: '',     
      tipo_origen: 'Externo',
      tipo_destino: 'Externo',
      tipo_movimiento: '',
      origen: '',
      destino: '',
      origen_saldo: '',
      destino_saldo: '',
    }

    this.cheque = {
      nro_cheque: '',
      concepto: '',
      cliente_descripcion: '',
      cliente: '',
      destino_descripcion: '',
      destino: '',
      emisor: '',
      cuit: '',
      importe: 0
    }
    
    this.data.centro_costos = this.centro_inicial;
    this.data.cuenta_contable = this.cuenta_inicial;
    this.data.tipo_movimiento = this.tipo_inicial;

    this.elementosOrigen = this.externos;
    this.elementosDestino = this.externos;

    this.saldos_origen = [];
    this.saldos_destino = [];
 
  };


  // Abrir modal
  abrirModal(): void {
    this.reiniciarFormulario();
    this.showModal = true;
  }

  // Abrir modal detalles
  abrirModalDetalles(id: string): void {
    this.showDatosCheque = false;
    this.showDatosMovimiento = true;
    this.alertService.loading();
    this.movimientosService.getMovimiento(id).subscribe(({ movimiento }) => {
      this.movimientoSeleccionado = movimiento;
      if(movimiento.cheque !== null){
        this.chequesService.getCheques(movimiento.cheque).subscribe( ({cheque}) => {
          this.mostrarCheque = cheque;
          this.alertService.close();
        },({error}) => {
          this.alertService.errorApi(error);
        });  
      }else{
        this.alertService.close();
      }
    });
    this.showModalDetalles = true;  
  }  

  // Regresar al modal - Nuevo tipo
  regresar(): void {
    this.showModalCheque = false;
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
    this.listarMovimientos();
  }
  
}
