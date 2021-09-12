import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { AlertService } from '../../services/alert.service';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes-movimientos',
  templateUrl: './reportes-movimientos.component.html',
  styles: [
  ]
})
export class ReportesMovimientosComponent implements OnInit {

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Reportes - Movimientos';
    this.listarMovimientos();
  }

  // Listar movimientos
  listarMovimientos(): void {
    this.alertService.loading();
    const data = {};
    this.reportesService.movimientos(data).subscribe(({ movimientos }) => {
      console.log(movimientos);
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });  
  }

}
