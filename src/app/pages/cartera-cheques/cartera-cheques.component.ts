import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { ChequesService } from '../../services/cheques.service';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-cartera-cheques',
  templateUrl: './cartera-cheques.component.html',
  styles: [
  ]
})
export class CarteraChequesComponent implements OnInit {

  // Empresa
  public id = '';
  public empresa: any;

  // Cheques
  public cheques: any = [];
  public totalImporte: number = 0;

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

  constructor(private dataService: DataService,
              private empresasService: EmpresasService,
              private activatedRoute: ActivatedRoute,
              private chequesService: ChequesService,
              private alertService: AlertService) { }

  // Inicio del componente
  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Cheques - Cartera";
    this.alertService.loading();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.id = id;
      this.empresasService.getEmpresa(id).subscribe(({empresa})=>{
        this.empresa = empresa;
        this.listarCheques();
      });
    });
  };

  // Listar cheques
  listarCheques(): void {
    this.chequesService.listarCheques(this.id, this.ordenar.direccion, this.ordenar.columna, this.filtro.activo).subscribe(({ cheques }) => {
      this.cheques = cheques;
      this.calcularTotal();
      this.alertService.close();
    });
  }

  // Calcular total
  calcularTotal(): void {
    let chequeTemp = 0;
    this.cheques.forEach( cheque => {
      chequeTemp += cheque.importe;
    });
    this.totalImporte = chequeTemp;
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.filtro.activo = activo;
    this.listarCheques();
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
  this.listarCheques();
  }

}
