import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ChequesService } from '../../services/cheques.service';
import { EmpresasService } from '../../services/empresas.service';
import { ExternosService } from '../../services/externos.service';
import { environment } from '../../../environments/environment';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { format } from 'date-fns';
import { CentroCostosService } from '../../services/centro-costos.service';
import { CuentaContableService } from '../../services/cuenta-contable.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cartera-cheques',
  templateUrl: './cartera-cheques.component.html',
  styles: [
  ]
})
export class CarteraChequesComponent implements OnInit {

  // Inicializando SIN ESPECIFICAR
  public tipo_inicial = '';
  public centro_inicial = '';
  public cuenta_inicial = '';

  // CENTRO DE COSTOS
  public centrosCostos: any[] = [];
  
  // CUENTA CONTABLE
  public cuentasContables: any[]= [];

  // MODAL
  public showModalDetalles = false;
  public showModalCobrarCheque = false;
  public showModalTransferirCheque = false;
  public showNuevoCheque = false;
  
  // EXTERNOS
  public externos: any[] = [];
  
  // EMPRESAS
  public id = '';
  public empresa: any;
  public saldos: any = [];
  public selectorSaldo = '';
  
  // CHEQUES
  public chequeSeleccionado: any;
  public cheques: any = [];
  public totalImporte: number = 0;
  public concepto = '';
  
  // SELECTOR
  public estadoSeleccionado = 'Activo';

  // DATOS - MOVIMIENTO
  public data = {
    
    cheque: '',
    concepto: '',
    comprobante: '',
    centro_costos: '',
    cuenta_contable: '',

    fecha_transferencia: format(Date.now(), 'yyyy-MM-dd'),
    fecha_cobro: format(Date.now(), 'yyyy-MM-dd'),
    fecha_cobrado: format(Date.now(), 'yyyy-MM-dd'),

    origen: "",
    origen_descripcion: "",
    origen_saldo_descripcion: 'CHEQUES',
    origen_saldo: "",
    tipo_origen: "Interno",
    // origen_monto_anterior -> DESDE BACK-END
    // origen_monto_nuevo: -> DESDE BACK-END
    
    destino: '',
    destino_descripcion: '',
    destino_saldo_descripcion: 'CHEQUES',
    destino_saldo: '',
    tipo_destino: "Interno",
    // destion_monto_anterior: -> DESDE BACK-END
    // destino_monto_nuevo: -> DESDE BACK-END

    tipo_movimiento: '',
    monto: 0,
    activo: true,
  
  }

  // DATOS - CHEQUE
  public nuevoCheque = {
    fecha_emision: format(Date.now(), 'yyyy-MM-dd'),
    fecha_cobro: '',
    banco: '',
    nro_cheque: '',
    concepto: '',
    cliente_descripcion: '',
    cliente: '',
    tipo_cliente: '',
    destino_descripcion: '',  // Razon social de empresa
    tipo_destino: '',
    destino: '',              // ID de empresa
    emisor: '',
    cuit: '',
    importe: null
  }

  // PAGINACION
  public paginaActual: number = 1;
  public cantidadItems: number = 10;
  
  // FILTRADO
  public filtro = {
    estado: 'Activo',
    parametro: ''
  }
  
  // DESTINO
  public tipoDestino: string = 'Externo';
  public destino: string = '';
  public destinos:any[] = [];

  // ORDENAR
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'fecha_cobro'
  }

  constructor(private dataService: DataService,
              public authService: AuthService,
              private empresasService: EmpresasService,
              private movimientosService: MovimientosService,
              private externosService: ExternosService,
              private activatedRoute: ActivatedRoute,
              private centroCostosService: CentroCostosService,
              private cuentaContableService: CuentaContableService,
              private chequesService: ChequesService,
              private alertService: AlertService) { }

  // Inicio del componente
  ngOnInit(): void {
    
    // RUTA ACTUAL
    this.dataService.ubicacionActual = "Dashboard - Cheques - Cartera";
    
    this.alertService.loading(); // -------------------------------------------->  Comienzo de carga
    
    // RUTA -> ID
    this.activatedRoute.params.subscribe(({ id }) => {
      
      this.id = id;
      
      // DATOS DE LA EMPRESA
      this.empresasService.getEmpresa(id).subscribe(({empresa})=>{
        
        this.empresa = empresa;
        
        // DATA -> DATOS DE ORIGEN (EMPRESA)
        this.data.origen = empresa._id;
        this.data.origen_descripcion = empresa.razon_social;
        this.data.origen_saldo = empresa.saldos_especiales.cheques; // Saldo de cheques
        
        // LISTADO DE CHEQUES
        this.chequesService.listarCheques(this.id, this.ordenar.direccion, this.ordenar.columna, '', this.filtro.estado).subscribe(({ cheques }) => {
          this.cheques = cheques;
          this.calcularTotal();
          
          // LISTADO DE SALDOS         
          this.empresasService.listarSaldos(1, 'descripcion', this.id).subscribe(({ saldos }) => {            
            this.saldos = saldos.filter(saldo => (saldo._id !== this.empresa.saldos_especiales.cheques));

            // LISTADO DE EXTERNOS
            this.externosService.listarExternos(1, 'descripcion').subscribe(({ externos })=>{    
              this.externos = externos.filter( externo => ( externo.activo ));
              this.destinos = this.externos;
              
              // LISTADO DE CENTROS DE COSTO
              this.centroCostosService.listarCentrosCostos().subscribe(({centros, centro_sin_especificar}) => {
                this.centrosCostos = centros.filter(centro => ( centro.activo ));
                this.centro_inicial = centro_sin_especificar._id;
                
                // LISTADO DE CUENTAS CONTABLES
                this.cuentaContableService.listarCuentasContables().subscribe(({ cuentasContables, cuenta_sin_especificar })=>{
                  this.cuentasContables = cuentasContables.filter( cuenta => ( cuenta.activo ) );
                  this.cuenta_inicial = cuenta_sin_especificar._id;          
                  
                  this.alertService.close(); // -------------------------------------------------------> Finalizacion de carga
                  
                },({error})=>{
                  this.alertService.errorApi(error);
                })

              },({error})=>{
                this.alertService.errorApi(error);
              });

            
            // ERROR: LISTADO DE EXTERNOS
            },({error})=>{
              this.alertService.errorApi(error);
            });           

          // ERROR: LISTADO SALDOS
          },({error})=>{
            this.alertService.errorApi(error);
          });          
        
        // ERROR: LISTADO CHEQUES
        },({error})=>{
          this.alertService.errorApi(error);
        });             

      });

    // ERROR: RUTA -> ID
    },({error})=>{
      this.alertService.errorApi(error);
    });
  
  };

  // Actualizar informacion de externo
  actualizarExterno(id: string): void {
    if(id !== ''){
      this.alertService.loading();
      this.externosService.getExterno(id).subscribe(({externo}) => {
        this.nuevoCheque.emisor = externo.descripcion;
        this.nuevoCheque.cuit = externo.dni_cuit; 
        this.alertService.close();
      });
    }
  }

  // Crear cheque
  crearCheque(): void {

    const { nro_cheque, concepto, cliente, importe, fecha_emision } = this.nuevoCheque;

    // Verificacion
    const verificacion = nro_cheque.trim() === '' ||
                         fecha_emision.trim() === '' ||
                         concepto.trim() === '' ||
                         cliente.trim() === '' ||
                         importe === null ||
                         importe < 0
                         

    if(verificacion) return this.alertService.formularioInvalido();

    const data: any = {};

    // ------------------- DATOS DE CHEQUE -------------------------

    // COMPLETANDO DATOS DE CHEQUE
    // this.nuevoCheque.cliente_descripcion -> BACK-END
    this.nuevoCheque.fecha_cobro = this.nuevoCheque.fecha_cobro === '' ? '1970-01-01' : this.nuevoCheque.fecha_cobro;
    this.nuevoCheque.destino = this.empresa._id;
    this.nuevoCheque.destino_descripcion = this.empresa.razon_social;
    this.nuevoCheque.tipo_cliente = this.data.tipo_origen;
    this.nuevoCheque.tipo_destino = this.data.tipo_destino;

    data.cheque = this.nuevoCheque;

    // ------------------- DATOS DE MOVIMIENTO ----------------------
    // this.data.cheque -> BACK-END
    // this.data.origen_descripcion -> BACK-END
    // this.origen_monto_anterior -> DESDE BACK-END
    // this.origen_monto_nuevo: -> DESDE BACK-END
    // destion_monto_anterior: -> DESDE BACK-END
    // destino_monto_nuevo: -> DESDE BACK-END
    this.data.comprobante = '';
    this.data.concepto = this.nuevoCheque.concepto;

    this.data.tipo_origen = 'Externo';
    this.data.origen = this.nuevoCheque.cliente;
    this.data.origen_saldo = '';
    this.data.origen_saldo_descripcion = '';
    this.data.tipo_destino = "Interno";
    this.data.destino = this.nuevoCheque.destino;
    this.data.destino_descripcion = this.nuevoCheque.destino_descripcion;
    this.data.destino_saldo_descripcion = 'CHEQUES';
    this.data.destino_saldo = this.empresa.saldos_especiales.cheques;
    this.data.monto = this.nuevoCheque.importe;
    this.data.tipo_movimiento = environment.tipo_ingreso_cheque;

    data.movimiento = this.data;
    
    this.alertService.loading();
    this.chequesService.nuevoChequeDesdeCartera(data).subscribe(()=>{
      this.reiniciarData();
      this.listarCheques();
      this.dataService.chequesCobrarHoy();
      this.showNuevoCheque = false;
    },({error})=>{
      this.alertService.errorApi(error);
    });

  }

  // Actualizar destino
  actualizarDestino(tipo: string): void {
    this.destino = '';
    if(tipo === 'Interno'){
      this.listarInternos();
    }else{
      this.listarExternos();
    }
  }

  // Listar externos
  listarExternos(): void {
    this.alertService.loading();
    this.externosService.listarExternos(1, 'descripcion').subscribe(({ externos })=>{
      this.destinos = externos.filter( externo => (externo.activo));
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  };

  // Listar internos
  listarInternos(): void {
    this.alertService.loading();
    this.empresasService.listarEmpresas(1, 'descripcion').subscribe(({ empresas }) => {
      this.destinos = empresas.filter( empresa => (empresa.activo && empresa._id != this.id));
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });  
  }

  // Listar cheques
  listarCheques(): void {
    this.alertService.loading();
    this.chequesService.listarCheques(this.id, this.ordenar.direccion, this.ordenar.columna, '', this.filtro.estado).subscribe(({ cheques }) => {
      this.cheques = cheques;
      this.calcularTotal();
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Calcular total
  calcularTotal(): void {
    let chequeTemp = 0;
    this.cheques.forEach( cheque => { chequeTemp += cheque.importe; });
    this.totalImporte = chequeTemp;
  }
  
  // Cobrar cheque
  cobrarCheque(): void {
    
    if(this.selectorSaldo === '' || this.data.fecha_cobro === '') return this.alertService.formularioInvalido();

    this.alertService.question({ msg: 'Estas por cobrar un cheque', buttonText: 'Cobrar' })
      .then(({isConfirmed}) => {  
        if (isConfirmed) {
          
          this.alertService.loading();
          
          this.data.tipo_origen = 'Interno',
          this.data.comprobante = '',
          this.data.origen = this.empresa._id;
          this.data.origen_descripcion = this.empresa.razon_social;
          this.data.origen_saldo_descripcion = 'CHEQUES';
          this.data.origen_saldo = this.empresa.saldos_especiales.cheques;
  
          this.data.tipo_destino = 'Interno',
          this.data.destino = this.empresa._id,
          this.data.destino_saldo = this.selectorSaldo;
          this.data.destino_descripcion = this.empresa.razon_social,
          
          this.data.tipo_movimiento = environment.tipo_cobro_cheque;
      
          this.movimientosService.cobrarCheque(this.data).subscribe( () => {
      
            this.listarCheques();
            this.reiniciarData();
            this.dataService.chequesCobrarHoy();
            this.showModalCobrarCheque = false;
                      
          },({ error })=>{
          
            this.alertService.errorApi(error);
          
          });           
        }
    });
  
  }

  // Endosar - Transferir cheque
  transferirCheque(destino: any): void {

    // Verificacion
    if(destino.value.trim() === '' || this.data.fecha_transferencia == '' || this.concepto.trim() === '') return this.alertService.info('Debe completar todos los campos');

    this.alertService.question({ msg: 'Estas por transferir un cheque', buttonText: 'Transferir' })
    .then(({isConfirmed}) => {  
      if (isConfirmed) {
        
        this.alertService.loading();
    
        // Se completa la data de envio - TRANSFERENCIA
        this.data.tipo_origen = 'Interno',
        this.data.origen = this.empresa._id;
        this.data.origen_descripcion = this.empresa.razon_social;
        this.data.origen_saldo_descripcion = 'CHEQUES';
        this.data.origen_saldo = this.empresa.saldos_especiales.cheques;
        this.data.comprobante = '';
        this.data.concepto = this.concepto;
        this.data.tipo_destino = this.tipoDestino;
        this.data.destino = this.destino;
        this.data.tipo_movimiento = environment.tipo_transferencia_cheque;   
        
        // Conexion con API-REST - Transferencia de cheque
        this.movimientosService.transferirCheque(this.data).subscribe(()=>{
          this.listarCheques();
          this.reiniciarData();
          this.dataService.chequesCobrarHoy();
          this.showModalTransferirCheque = false;
        },({error})=>{
        
          this.alertService.errorApi(error);
        
        });        
      }
    });
  
  }

  // Regresar a detalles
  regresarDetalles(): void {
    this.showModalDetalles = true;
    this.showModalCobrarCheque = false; 
    this.showModalTransferirCheque = false; 
  }

  // Modal: Abrir detalles
  modalDetalles(cheque: any): void {
    
    window.scrollTo(0,0);

    // Se selecciona el cheque
    this.chequeSeleccionado= cheque;

    this.data.cheque = cheque._id;
    this.data.monto = cheque.importe;
    this.data.concepto = cheque.concepto;
    
    this.showModalDetalles = true;
    
  }

  // Modal: Abrir nuevo cheque
  modalNuevoCheque(): void {
    window.scrollTo(0,0);
    this.reiniciarData();
    this.showNuevoCheque = true;
  }
  
  // Modal: Cobrar cheques
  modalCobrar(): void {
   
    window.scrollTo(0,0);
  
    this.data.centro_costos = this.centro_inicial;
    this.data.cuenta_contable = this.cuenta_inicial;

    this.data.fecha_cobrado = format(Date.now(), 'yyyy-MM-dd'),
    this.selectorSaldo = '';
    this.data.destino_saldo_descripcion = '';
    this.data.destino_saldo = '';
    this.showModalDetalles = false;
    this.showModalCobrarCheque = true;
  }

  // Modal: Transferir cheque
  modalTransferir(): void {

    window.scrollTo(0,0);

    this.data.centro_costos = this.centro_inicial;
    this.data.cuenta_contable = this.cuenta_inicial;

    // Reiniciando valores del modal
    this.tipoDestino = 'Externo';
    this.destino = '';
    this.concepto = '';

    this.listarExternos();
  
    this.showModalDetalles = false;
    this.showModalTransferirCheque = true;
 
  }

  // Filtrar por estado
  filtrarPorEstado(estado: any): void{
    this.paginaActual = 1;
    this.filtro.estado = estado;
    this.listarCheques();
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
    this.listarCheques();
  }

  // Reiniciar data
  reiniciarData(){
    this.data = {
      cheque: this.data.cheque,
      concepto: '',
      comprobante: '',
      centro_costos: '',
      cuenta_contable: '',
      fecha_cobrado: format(Date.now(), 'yyyy-MM-dd'),
      fecha_transferencia: format(Date.now(), 'yyyy-MM-dd'),
      fecha_cobro: format(Date.now(), 'yyyy-MM-dd'),
      origen: "", 
      origen_descripcion: "",
      origen_saldo_descripcion: 'CHEQUES',
      origen_saldo: "",
      tipo_origen: "Interno", 
      destino: '',
      destino_descripcion: '',
      destino_saldo_descripcion: 'CHEQUES',
      destino_saldo: '',
      tipo_destino: "Interno",
      tipo_movimiento: environment.tipo_cheque, 
      monto: 0, 
      activo: true,   
    }
    
    // DATOS - CHEQUE
    this.nuevoCheque = {
      fecha_emision: format(Date.now(), 'yyyy-MM-dd'),
      fecha_cobro: '',
      banco: '',
      nro_cheque: '',
      concepto: '',
      cliente_descripcion: '',
      tipo_cliente: '',
      cliente: '',
      destino_descripcion: '',  // Razon social de empresa
      tipo_destino: '',
      destino: '',              // ID de empresa
      emisor: '',
      cuit: '',
      importe: null
    }

    this.data.centro_costos = this.centro_inicial;
    this.data.cuenta_contable = this.cuenta_inicial;
    
    console.log(this.data.centro_costos);

  }

}
