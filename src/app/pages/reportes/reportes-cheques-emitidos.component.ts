import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ExternosService } from 'src/app/services/externos.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-reportes-cheques-emitidos',
  templateUrl: './reportes-cheques-emitidos.component.html',
  styles: [
  ]
})
export class ReportesChequesEmitidosComponent implements OnInit {

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private empresasService: EmpresasService,
              private externosService: ExternosService,
              private reportesService: ReportesService) { }

  // Modals
  showModalDetalles = false;

  // Empresas
  public empresas: any[] = [];

  // Externos
  public externos: any[] = [];

  // Emisores
  public emisores: any[] = [];
  
  // Destinos
  public destinos: any[] = [];

  // Cheques
  public cheques: any[] = [];
  public chequeSeleccionado: any = {};

  public filtroCheques = {
    estado: '',
    tipoDestino: '',
    fechaDesde: '',
    fechaHasta: '',
    cliente: '',
    destino: '' 
  }

  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'fecha_emision'
  }

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 5;

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Reportes - Cheques emitidos';
    
    this.alertService.loading();

    // LISTADO DE EMISORES
    this.empresasService.listarEmpresas(1, 'razon_social').subscribe( ({ empresas }) => {
      this.empresas = empresas;
      this.emisores = empresas;
      this.destinos = empresas;
      this.externosService.listarExternos().subscribe(({externos})=> {
        this.externos = externos;  
        this.alertService.close();    
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
    this.reportesService.chequesEmitidos(this.ordenar.direccion, this.ordenar.columna, this.filtroCheques).subscribe(({cheques})=>{
      this.cheques = cheques;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    }); 
  }

  // Cambiar destinos
  cambiarDestinos(): void {
    this.filtroCheques.destino = "";
    if(this.filtroCheques.tipoDestino === "Interno"){
      this.destinos = this.empresas;
    }else{
      this.destinos = this.externos;
    } 
  }

  // Modal: Abrir modal detalles
  modalDetalles(cheque: any): void {
    this.chequeSeleccionado = cheque;
    this.showModalDetalles = true;
  }

  // Listar emisores
  listarEmisores(): void {
    this.empresasService.listarEmpresas(1, 'descripcion').subscribe( ({ empresas }) => {
      this.emisores = empresas;    
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Listar externos
  listarExternos(): void {
    this.externosService.listarExternos().subscribe(({externos})=> {
      this.externos = externos;      
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
