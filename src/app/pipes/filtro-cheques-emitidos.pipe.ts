import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroChequesEmitidos'
})
export class FiltroChequesEmitidosPipe implements PipeTransform {

  transform(valores: any[], parametro: string): any {
        
    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();
    
    if(parametro.length !== 0){
      return valores.filter( valor => { 
        return valor.nro_cheque.toLocaleLowerCase().includes(parametro) ||
               valor.destino_descripcion.toLocaleLowerCase().includes(parametro)
      });
    }else{
      return valores;
    }

  }

}
