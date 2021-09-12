import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
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
              private reportesService: ReportesService) { }

  // Emisores
  public emisores: any[] = [];
  
  public filtroCheques = {
    fechaDesde: '',
    fechaHasta: '',
    emisor: '',
    destino: '' 
  }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Reportes - Cheques emitidos';
    
    // LISTADO DE EMISORES
    this.empresasService.listarEmpresas(1, 'razon_social').subscribe( ({ empresas }) => {
      this.emisores = empresas;    
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Listar emisores
  listarEmisores(): void {
    this.empresasService.listarEmpresas(1, 'descripcion').subscribe( ({ empresas }) => {
      this.emisores = empresas;    
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
