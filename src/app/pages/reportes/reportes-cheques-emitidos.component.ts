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

  // Empresas
  public empresas: any[] = [];

  // Externos
  public externos: any[] = [];

  // Emisores
  public emisores: any[] = [];
  
  // Destinos
  public destinos: any[] = [];

  public filtroCheques = {
    tipoDestino: 'Interno',
    fechaDesde: '',
    fechaHasta: '',
    emisor: '',
    destino: '' 
  }

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
    console.log(this.filtroCheques);  
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

  // Listar cheques emitidos
  listarCheques(): void {
    this.alertService.loading();
    const data = {};
    this.reportesService.chequesEmitidos(data).subscribe(({ cheques }) => {
      console.log(cheques);
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });  
  }
  
}
