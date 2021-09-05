import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroCarteraCheques'
})
export class FiltroCarteraChequesPipe implements PipeTransform {

  transform(valores: any[], parametro: string): any {
        
    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();
    
    if(parametro.length !== 0){
      return valores.filter( valor => { 
        return valor.nro_cheque.toLocaleLowerCase().includes(parametro) ||
               valor.cliente_descripcion.toLocaleLowerCase().includes(parametro)
      });
    }else{
      return valores;
    }

  }

}
