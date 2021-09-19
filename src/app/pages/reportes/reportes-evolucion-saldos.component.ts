import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { environment } from 'src/environments/environment';
import { ChequesService } from '../../services/cheques.service';

@Component({
  selector: 'app-reportes-evolucion-saldos',
  templateUrl: './reportes-evolucion-saldos.component.html',
  styles: [
  ]
})
export class ReportesEvolucionSaldosComponent implements OnInit {
  
  // Tipos especiales
  public tipo_cheque_emitido = environment.tipo_emision_cheque;
  public tipo_emitido_cobrado = environment.tipo_cheque_emitido_cobrado;

  // Modals
  public showModalDetalles = false;

  // Flags
  public showDatosMovimiento = true;
  public showDatosCheque = false;

  // Empresas
  public empresas: any[];

  // Saldos
  public saldos: any[];

  // Evolucion
  public evoluciones: any[] = [];

  // Movimientos
  public movimientoSeleccionado: any;

  // Cheque
  public chequeSeleccionado: any;

  public filtroSaldos = {
    fechaDesde: '',
    fechaHasta: '',
    empresa: '',
    saldo: ''
  }

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
              private empresasService: EmpresasService,
              private movimientosService: MovimientosService,
              private chequesService: ChequesService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Reportes - Evolución de saldos';
    this.alertService.loading();
    this.empresasService.listarEmpresas(1, 'razon_social').subscribe(({empresas})=>{
      this.empresas = empresas;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Cambiar empresa
  cambiarEmpresa(): void {
    this.filtroSaldos.saldo = '';
    if(this.filtroSaldos.empresa !== '') this.listarSaldos();
  }

  // Listar saldos
  listarSaldos(): void {
    this.alertService.loading();
    this.empresasService.listarSaldos(1, 'descripcion', this.filtroSaldos.empresa).subscribe(({saldos})=>{
      this.saldos = saldos;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }
  
  // Modal: Detalle de movimiento
  detalleMovimiento(evolucion: any): void {
    window.scrollTo(0,0);
    this.showDatosMovimiento = true;
    this.showDatosCheque = false;
    this.alertService.loading();
    this.movimientosService.getMovimiento(evolucion.movimiento).subscribe(({movimiento}) => {
      this.movimientoSeleccionado = movimiento;
      if(movimiento.cheque !== null){
        this.chequesService.getCheques(movimiento.cheque).subscribe(({cheque}) => {
          this.chequeSeleccionado = cheque;
          this.showModalDetalles = true;
          this.alertService.close();
        },({error})=>{
          this.alertService.errorApi(error);
        });
      }else{
        this.showModalDetalles = true;
        this.alertService.close();
      }
    },({error})=>{
      this.alertService.errorApi(error);
    }); 
  }

  // Buscar
  buscar(): void {

    this.paginaActual = 1;

    // Verificacion
    if(this.filtroSaldos.empresa === '' || this.filtroSaldos.saldo === '') return this.alertService.info('Debe seleccionar un saldo');

    this.alertService.loading();

    this.reportesService.saldos(this.ordenar.direccion, this.ordenar.columna, this.filtroSaldos).subscribe(({ saldos }) => {
      this.evoluciones = saldos;
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
