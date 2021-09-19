import { Component, OnInit } from '@angular/core';
import format from 'date-fns/format';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from '../../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { EmpresasService } from '../../services/empresas.service';
import { ExternosService } from 'src/app/services/externos.service';
import { environment } from '../../../environments/environment';
import { ChequesService } from 'src/app/services/cheques.service';
import { CentroCostosService } from '../../services/centro-costos.service';
import { CuentaContableService } from '../../services/cuenta-contable.service';

@Component({
  selector: 'app-cheques-emitidos',
  templateUrl: './cheques-emitidos.component.html',
  styles: [
  ]
})
export class ChequesEmitidosComponent implements OnInit {
 
  // Inicializando SIN ESPECIFICAR
  public tipo_inicial = '';
  public centro_inicial = '';
  public cuenta_inicial = '';
  
  // CENTROS DE COSTOS
  public centrosCostos: any[] = [];

  // CUENTA CONTABLE
  public cuentasContables: any[] = [];

  // SELECTOR DE ESTADO
  public estadoSeleccionado = 'true';

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
  
  // DESTINO
  public destinos: any = [];

  // CHEQUES
  public chequeSeleccionado: any;
  public cheques: any = [];
  public totalImporte: number = 0;

  // PAGINACION
  public paginaActual: number = 1;
  public cantidadItems: number = 10;
  
  // FILTRADO
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // ORDENAR
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'fecha_cobro'
  }

  // DATOS - MOVIMIENTO
  public data = {
  
    cheque: '',
    concepto: '',
    comprobante: '',
    centro_costos: '',
    cuenta_contable: '',
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
    tipo_destino: "Externo",
    // destion_monto_anterior: -> DESDE BACK-END
    // destino_monto_nuevo: -> DESDE BACK-END

    tipo_movimiento: '',
    monto: 0,
    activo: true,
  
  }

  // DATOS - CHEQUE
  public nuevoCheque = {
    fecha_emision: format(Date.now(), 'yyyy-MM-dd'),
    fecha_cobrado: format(Date.now(), 'yyyy-MM-dd'),
    fecha_cobro: '',
    banco_id: '',
    banco: '',
    nro_cheque: '',
    concepto: '',
    tipo_cliente: '',
    cliente_descripcion: '',
    cliente: '',
    tipo_destino: '',
    destino_descripcion: '',  // Razon social de empresa
    destino: '',              // ID de empresa
    emisor: '',
    cuit: '',
    importe: null
  }

  constructor(private alertService: AlertService,
              private dataService: DataService,
              private activatedRoute: ActivatedRoute,
              private empresasService: EmpresasService,
              private chequesService: ChequesService,
              private centroCostosService: CentroCostosService,
              private cuentaContableService: CuentaContableService,
              private externosService: ExternosService) { }

  ngOnInit(): void {

      // RUTA ACTUAL
      this.dataService.ubicacionActual = "Dashboard - Cheques - Emitidos";

      this.alertService.loading();

      this.activatedRoute.params.subscribe( ({id}) => {
        
        // DATOS DE EMPRESA
        this.empresasService.getEmpresa(id).subscribe( ({ empresa }) => {
          this.id = empresa._id;
          this.empresa = empresa;
          
          this.nuevoCheque.cliente = empresa._id;
          this.nuevoCheque.emisor = empresa.razon_social;
          this.nuevoCheque.cuit = empresa.cuit;

          // LISTAR SALDOS
          this.empresasService.listarSaldos(1, 'descripcion', this.id).subscribe( ({ saldos }) => {
            this.saldos = saldos.filter(saldo => ( saldo.activo && saldo.descripcion !== 'CAJA' && saldo.descripcion !== 'CHEQUES' ));
          
              // LISTAR EXTERNOS
              this.externosService.listarExternos().subscribe(({externos}) => {
                this.externos = externos.filter(externo => (externo.activo));
                this.destinos = externos;

                  this.chequesService.listarChequesEmitidos(this.id, this.ordenar.direccion, this.ordenar.columna, this.filtro.activo, 'Emitido').subscribe(({cheques}) => {
                    this.cheques = cheques;
                    this.calcularTotal(cheques);
                    
                    this.centroCostosService.listarCentrosCostos().subscribe(({centros, centro_sin_especificar}) => {
                      this.centrosCostos = centros.filter(centro => (centro.activo));
                      this.centro_inicial = centro_sin_especificar._id;

                      this.cuentaContableService.listarCuentasContables().subscribe(({cuentasContables, cuenta_sin_especificar}) => {
                        this.cuentasContables = cuentasContables.filter(cuenta => (cuenta.activo));
                        this.cuenta_inicial = cuenta_sin_especificar._id;
                        
                        this.alertService.close();
                      
                      },({error})=>{
                        this.alertService.errorApi(error);
                      })

                    },({error})=>{
                      this.alertService.errorApi(error);
                    });
                    
                  },({error})=>{
                    this.alertService.errorApi(error);
                  });

              },({error})=>{
                this.alertService.errorApi(error);
              })
          
          },({error})=>{
            this.alertService.errorApi(error);
          });      
    
        },({error})=>{
          this.alertService.errorApi(error);
        });

      });
  
    }

  // Listar cheques
  listarCheques(): void {
    this.alertService.loading();
    this.chequesService.listarChequesEmitidos(this.id, this.ordenar.direccion, this.ordenar.columna, this.filtro.activo, 'Emitido').subscribe(({cheques}) => {
      this.cheques = cheques;
      this.calcularTotal(cheques);
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Cheque cobrado
  chequeCobrado(): void {
    
    // Verificacion de fecha
    if(this.nuevoCheque.fecha_cobrado === '') return this.alertService.info('Debe colocar una fecha válida');

    const data = {
      movimiento: {

        cheque: this.chequeSeleccionado._id,
        comprobante: '',
        centro_costos: this.data.centro_costos,
        cuenta_contable: this.data.cuenta_contable,
        concepto: this.chequeSeleccionado.concepto,

        tipo_origen: 'Interno',
        origen: this.chequeSeleccionado.cliente,
        origen_descripcion: this.chequeSeleccionado.cliente_descripcion,
        origen_saldo: this.chequeSeleccionado.banco_id,      
        // origen_saldo_descripcion
        
        tipo_destino: 'Interno',
        destino: this.chequeSeleccionado.cliente,
        destino_descripcion: this.chequeSeleccionado.cliente_descripcion,
        destino_saldo: this.chequeSeleccionado.banco_id,      
        // destino_saldo_descripcion
        
        tipo_movimiento: environment.tipo_cheque_emitido_cobrado,
        monto: this.chequeSeleccionado.importe,

      },
      cheque: {
        cheque_id: this.chequeSeleccionado._id,
        banco_id: this.chequeSeleccionado.banco_id,
        importe: this.chequeSeleccionado.importe,
        fecha_cobrado: this.nuevoCheque.fecha_cobrado
      }
    }

    this.alertService.question({ msg: 'Estas por colocar al cheque como cobrado', buttonText: 'Cheque cobrado' })
    .then(({isConfirmed}) => {  
    if (isConfirmed) {
      this.alertService.loading();
      this.chequesService.emitidoCobrado(data).subscribe(()=>{
        this.showModalCobrarCheque = false;
        this.listarCheques();
      },({error})=>{
        this.alertService.errorApi(error);
      });    
    }
    });
  }

  // Emitir cheque
  emitirCheque(): void {
    
    const { fecha_emision, nro_cheque, concepto, banco_id, importe, destino } = this.nuevoCheque;

    const verificacion = fecha_emision === '' ||
                         nro_cheque.trim() === '' ||
                         concepto.trim() === '' ||
                         banco_id === '' ||
                         importe === null || importe < 0 ||
                         destino === ''
    
    if(verificacion) return this.alertService.formularioInvalido();

    // DATOS DE CHEQUE
    this.nuevoCheque.cliente_descripcion = this.empresa.razon_social;
    this.nuevoCheque.tipo_cliente = 'Interno',
    this.nuevoCheque.tipo_destino = this.data.tipo_destino;
    // banco - Back
    // destino_descripcion - Back
    // Trabajar fecha de cobro
    
    // DATOS DE MOVIMIENTO
    // cheque - Back
    // destino_descripcion - Back
    // destino_saldo - Back
    // Fecha cobro
    
    this.data.concepto = this.nuevoCheque.concepto;
    this.data.comprobante = '';
    this.data.destino = this.nuevoCheque.destino;
    this.data.destino_saldo_descripcion = 'CHEQUES';
    this.data.monto = this.nuevoCheque.importe;
    this.data.origen = this.nuevoCheque.cliente;
    this.data.origen_descripcion = this.nuevoCheque.cliente_descripcion;
    this.data.origen_saldo = this.nuevoCheque.banco_id;
    this.data.origen_saldo_descripcion = 'CHEQUES';
    this.data.tipo_origen = 'Interno';
    this.data.tipo_movimiento = environment.tipo_emision_cheque;

    const data: any = {
      cheque: this.nuevoCheque,
      movimiento: this.data
    };

    this.alertService.question({ msg: 'Estas por emitir un cheque', buttonText: 'Emitir' })
    .then(({isConfirmed}) => {  
    if (isConfirmed) {
      this.alertService.loading();
      console.log(data);
      this.chequesService.emitirCheque(data).subscribe(() => {
        this.listarCheques();
        this.dataService.chequesCobrarHoy();
        this.showNuevoCheque = false;
      },({error})=>{
        this.alertService.errorApi(error);
      });      
   
    }
    });

  }

  // Calcular total en cheques
  calcularTotal(cheques: any[]): void {
    let totalTemp = 0;
    cheques.forEach(cheque => {
      totalTemp += cheque.importe;  
    });
    this.totalImporte = totalTemp;
  }

  // Actualizar destino
  actualizarDestino(): void {
    this.nuevoCheque.destino = '';
    if(this.data.tipo_destino === 'Interno'){
      this.listarInternos();
    }else if(this.data.tipo_destino === 'Externo'){
      this.listarExternos();
    }
  }

  // Destinos internos
  listarInternos(): void {
    this.alertService.loading();
    this.empresasService.listarEmpresas().subscribe(({empresas}) => {
      this.destinos = empresas.filter( empresa => (empresa.activo && empresa._id !== this.id));
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Destinos externos
  listarExternos(): void {
    this.alertService.loading();
    this.externosService.listarExternos().subscribe(({externos}) => {
      this.destinos = externos.filter(externo => (externo.activo));
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }
  
  // Modal - Emitir cheque
  modalEmitirCheque(): void {
    this.reiniciarFormulario();
    this.listarExternos();
    this.nuevoCheque.cliente = this.empresa._id;
    this.nuevoCheque.emisor = this.empresa.razon_social;
    this.nuevoCheque.cuit = this.empresa.cuit;
    this.showNuevoCheque = true;
  }

  // Modal - Detalles
  modalDetalles(id: string): void {
    this.showModalDetalles = true;
    this.alertService.loading();
    this.chequesService.getCheques(id).subscribe(({cheque}) => {
      this.chequeSeleccionado = cheque;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Modal - Cobrar cheque
  modalCobrarCheque(): void {
    // this.reiniciarSinEspecificar();
    this.data.centro_costos = this.centro_inicial;
    this.data.cuenta_contable = this.cuenta_inicial;   
    this.nuevoCheque.fecha_cobrado = format(Date.now(), 'yyyy-MM-dd');
    this.showModalCobrarCheque = true;
    this.showModalDetalles = false;
  }

  // Regresar a detalles
  regresarDetalles(): void {
    this.showModalDetalles = true;
    this.showModalCobrarCheque = false; 
    this.showModalTransferirCheque = false; 
  }

  // Reiniciar formulario
  reiniciarFormulario(): void {

      // DATOS - MOVIMIENTO
    this.data = {
    
      cheque: '',      // back
      concepto: '',
      comprobante: '',
      centro_costos: '',
      cuenta_contable: '',
      
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
      tipo_destino: "Externo",
      // destion_monto_anterior: -> DESDE BACK-END
      // destino_monto_nuevo: -> DESDE BACK-END
  
      tipo_movimiento: '',
      monto: 0,
      activo: true,
    
    }

    // DATOS - CHEQUE
    this.nuevoCheque = {
      fecha_emision: format(Date.now(), 'yyyy-MM-dd'),
      fecha_cobrado: format(Date.now(), 'yyyy-MM-dd'),
      fecha_cobro: '', 
      banco_id: '', 
      banco: '',
      nro_cheque: '', 
      concepto: '', 
      cliente_descripcion: '', 
      tipo_cliente: '',
      cliente: '', 
      destino_descripcion: '',
      tipo_destino: '',  
      destino: '',         
      emisor: '',  
      cuit: '',  
      importe: null
    }  
  
    this.data.centro_costos = this.centro_inicial;
    this.data.cuenta_contable = this.cuenta_inicial;   

    console.log(this.data.centro_costos);

    // this.reiniciarSinEspecificar();
    
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

  // Filtrar por estado
  filtrarPorEstado(activo: any): void{
    this.paginaActual = 1;
    this.filtro.activo = activo;
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

}
