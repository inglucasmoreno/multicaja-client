import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AlertasSistemaService {

  constructor(private http: HttpClient) { }

  // Cheques que se deben de cobrar
  alertaChequesCobrar(direccion : number = 1, columna: string = 'fecha_cobro' ): Observable<any> {
    return this.http.get(`${baseUrl}/alertas/cobrar-cheques`,{
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }
    })
  };

  chequesEmitidosPorVencer(): void {

  }

}
