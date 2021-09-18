import { Injectable } from '@angular/core';
import { AlertasSistemaService } from './alertas-sistema.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  public ubicacionActual: string = 'Dashboard';
  public cobrarHoyAlert = false;
  public chequesCobrar: any = [];

  constructor(private alertasSistemaService: AlertasSistemaService) { }
  
  // Cheques que se debe cobrar hoy
  chequesCobrarHoy(): void { 
    this.alertasSistemaService.alertaChequesCobrar().subscribe(({ cheques }) => {
      this.chequesCobrar = cheques;
      if(cheques.length > 0) {
        this.cobrarHoyAlert = true;
      }else{
        this.cobrarHoyAlert = false;
      }
    },({error})=>{});      
  }

  
}
