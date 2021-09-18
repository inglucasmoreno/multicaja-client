import { Component, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { AlertasSistemaService } from '../../services/alertas-sistema.service';
import { CentroCostosService } from '../../services/centro-costos.service';
import { CuentaContableService } from '../../services/cuenta-contable.service';
import { EmpresasService } from '../../services/empresas.service';
import { MovimientosService } from '../../services/movimientos.service';

@Component({
  selector: 'app-cobrar-cheque',
  templateUrl: './cobrar-cheque.component.html',
  styles: [
  ]
})
export class CobrarChequeComponent implements OnInit {

  // MODAL
  public showModalDetalles = false;
  public showModalCobrarCheque = false;

  // CHEQUES
  public cheques: any[] = [];
  public chequeSeleccionado: any;

  // CENTROS DE COSTOS
  public centrosCostos: any[] = [];

  // CUENTAS CONTABLES
  public cuentasContables: any[] = [];

  // SALDOS
  public saldos;
  public selectorSaldo: any = '';

  // DATA
  public data: any = {
    cheque: '',
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

  // PAGINACION
  public paginaActual: number = 1;
  public cantidadItems: number = 10;
  
  // FILTRADO
  public filtro = {
    estado: 'Activo',
    parametro: ''
  }

  // ORDENAR
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'fecha_cobro'
  }

  constructor(private dataService: DataService,
              private alertasSistemaService: AlertasSistemaService,
              private centrosCostosService: CentroCostosService,
              private cuentaContableService: CuentaContableService,
              private movimientosService: MovimientosService,
              private empresasService: EmpresasService,
              private alertService: AlertService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Alertas - Cheques'
    this.alertService.loading();
    this.alertasSistemaService.alertaChequesCobrar(this.ordenar.direccion, this.ordenar.columna).subscribe( ({ cheques }) => {
      this.cheques = cheques;
      this.centrosCostosService.listarCentrosCostos().subscribe(({ centros }) => {
        this.centrosCostos = centros;
        this.cuentaContableService.listarCuentasContables().subscribe(({ cuentasContables }) => {
          this.cuentasContables = cuentasContables;
          this.alertService.close();
        },({error})=>{
          this.alertService.errorApi(error);
        });
      },({error})=>{
        this.alertService.errorApi(error);
      });  
    },({error})=>{
      this.alertService.errorApi(error);
    });   
  }

  // Listar cheques a cobrar
  listarCheques(): void {
    this.alertService.loading();
    this.alertasSistemaService.alertaChequesCobrar(this.ordenar.direccion, this.ordenar.columna).subscribe( ({ cheques }) => {
      this.cheques = cheques;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Listar saldos
  listarSaldos(): void {
    this.alertService.loading();
    this.empresasService.listarSaldos(1,'descripcion',this.chequeSeleccionado.destino).subscribe(({ saldos }) => {
      
      saldos.forEach( saldo => {
        if(saldo.descripcion === 'CHEQUES') this.data.origen_saldo = saldo._id;
      });
      
      this.saldos = saldos.filter(saldo => (saldo.descripcion != 'CHEQUES'));
    
      this.alertService.close();
    
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }
  
  // Regresar a detalles
  regresarDetalles(): void {
    this.showModalDetalles = true;
    this.showModalCobrarCheque = false; 
  }

  // Modal: Cobrar cheque
  modalCobrarCheque(): void {
    this.reiniciarSinEspecificar();
    this.listarSaldos();
    this.data.fecha_cobrado = format(Date.now(), 'yyyy-MM-dd'),
    this.selectorSaldo = '';
    this.data.destino_saldo_descripcion = '';
    this.data.destino_saldo = '';
    this.showModalDetalles = false;
    this.showModalCobrarCheque = true;
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
        this.data.origen = this.chequeSeleccionado.destino;
        this.data.origen_descripcion = this.chequeSeleccionado.destino_descripcion;
        this.data.origen_saldo_descripcion = 'CHEQUES';
        // this.data.origen_saldo = this.empresa.saldos_especiales.cheques;

        this.data.tipo_destino = 'Interno',
        this.data.destino = this.chequeSeleccionado.destino,
        this.data.destino_saldo = this.selectorSaldo;
        this.data.destino_descripcion = this.chequeSeleccionado.destino_descripcion,
        
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
    
    this.reiniciarSinEspecificar();
  
  }

  reiniciarSinEspecificar(): void {
    // Sin especificar - Centros costos
    this.centrosCostos.forEach( centro => {
      if(centro.descripcion === 'SIN ESPECIFICAR'){
        this.data.centro_costos = centro._id; 
      }
    });

    // Sin especificar - Cuenta contable
    this.cuentasContables.forEach( cuenta => {
      if(cuenta.descripcion === 'SIN ESPECIFICAR'){
        this.data.cuenta_contable = cuenta._id;
      }
    });    
  }

  // Seleccionar cheque
  seleccionarCheque(cheque: any): void {
    this.chequeSeleccionado = cheque;
    this.data.cheque = cheque._id;
    this.data.monto = cheque.importe;
    this.data.concepto = cheque.concepto;
    this.showModalDetalles = true; 
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.alertService.loading();
    this.listarCheques();
  }

}
