import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroMovimientos'
})
export class FiltroMovimientosPipe implements PipeTransform {

  transform(valores: any[], parametro: string): any {
        
    // Filtrado por parametro
    parametro = parametro.toLocaleLowerCase();
    
    if(parametro.length !== 0){
      return valores.filter( valor => { 
        return valor.origen_descripcion.toLocaleLowerCase().includes(parametro) ||
               valor.destino_descripcion.toLocaleLowerCase().includes(parametro) ||
               valor.tipo_movimiento.descripcion.toLocaleLowerCase().includes(parametro)
      });
    }else{
      return valores;
    }

  }

}
