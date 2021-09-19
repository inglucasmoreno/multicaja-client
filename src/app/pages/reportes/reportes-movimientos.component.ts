import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from '../../services/alert.service';
import { ReportesService } from '../../services/reportes.service';
import { TipoMovimientoService } from '../../services/tipo-movimiento.service';
import { ExternosService } from '../../services/externos.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { ChequesService } from 'src/app/services/cheques.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reportes-movimientos',
  templateUrl: './reportes-movimientos.component.html',
  styles: [
  ]
})
export class ReportesMovimientosComponent implements OnInit {

  // Tipos especiales
  public tipo_cheque_emitido = environment.tipo_emision_cheque;
  public tipo_emitido_cobrado = environment.tipo_cheque_emitido_cobrado;

  // Flags
  public showDatosMovimiento = true;
  public showDatosCheque = false;

  // Cheque
  public mostrarCheque: any;

  // Modals
  public showModalDetalles: any = false;

  // Movimientos
  public movimientoSeleccionado: any;
  public movimientos: any[] = [];

  // Externos
  public externos: any[] = [];

  // Empresas
  public empresas: any[] = [];

  // Tipo de movimientos
  public tipoMovimientos: any[] = [];

  // Origenes
  public origenes: any[] = [];

  // Destinos
  public destinos: any[] = [];

  public filtroMovimientos = {
    desde: '',
    hasta: '',
    tipo_movimiento: '',
    tipo_origen: '',
    tipo_destino: '',
    origen: '',
    destino: ''
  };

   // Ordenar
   public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
  }

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 5;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private tipoMovimientoService: TipoMovimientoService,
              private chequesService: ChequesService,
              private empresasService: EmpresasService,
              private externosService: ExternosService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Reportes - Movimientos';
    this.alertService.loading();
    this.tipoMovimientoService.listarTipos().subscribe(({ tipos }) => {  // TIPO DE MOVIMIENTOS
      this.tipoMovimientos = tipos.filter(tipo => (tipo.activo));
      this.externosService.listarExternos().subscribe(({ externos }) => { // EXTERNOS
        this.externos = externos.filter(externo => (externo.activo));
        this.empresasService.listarEmpresas().subscribe(({empresas})=> {  // EMPRESAS
          this.empresas = empresas.filter(empresa => (empresa.activo));
          this.alertService.close();
        });
      },({error})=>{
        this.alertService.errorApi(error);
      });     
    },({error})=>{
      this.alertService.errorApi(error);
    });    
  }

  // Buscar
  buscar(): void {
    this.paginaActual = 1;
    this.alertService.loading();
    this.reportesService.movimientos(this.ordenar.direccion, this.ordenar.columna, this.filtroMovimientos).subscribe( ({movimientos}) => {
      this.movimientos = movimientos;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Cambiar origen
  cambiarOrigen(): void {
    this.filtroMovimientos.origen = '';
    if(this.filtroMovimientos.tipo_origen === 'Interno'){
      this.origenes = this.empresas;
    }else{
      this.origenes = this.externos;
    }
  }

  // Cambiar destino
  cambiarDestino(): void {
    this.filtroMovimientos.destino = '';
    if(this.filtroMovimientos.tipo_destino === 'Interno'){
      this.destinos = this.empresas;
    }else{
      this.destinos = this.externos;
    }
  }

  // Modal: Detalle de movimientos
  modalDetalles(movimiento): void {
    window.scrollTo(0,0);
    this.showDatosMovimiento = true;
    this.showDatosCheque = false;
    this.movimientoSeleccionado = movimiento;
    if(movimiento.cheque !== null){
      this.alertService.loading();
      this.chequesService.getCheques(movimiento.cheque).subscribe( ({cheque}) => {
        this.mostrarCheque = cheque;
        this.alertService.close();
      },({error})=>{
        this.alertService.errorApi(error);
      });
    }
    this.showModalDetalles = true;
  }

  // Listar tipo de movimientos
  listarTipoMovimientos(): void {
    this.tipoMovimientoService.listarTipos().subscribe(({ movimientos }) => {
      this.tipoMovimientos = movimientos;
    },({error})=>{
      this.alertService.errorApi(error);
    });    
  }

  // Listar movimientos
  listarMovimientos(): void {
    this.alertService.loading();
    const data = {};
    this.reportesService.movimientos(1, 'createdAt', data).subscribe(({ movimientos }) => {
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });  
  }

  // Ordenar por fecha
  ordenarFecha(): void {
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1;
    this.buscar();
  }

}
