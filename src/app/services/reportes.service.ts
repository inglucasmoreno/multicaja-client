import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http: HttpClient) { }

  // Movimientos
  movimientos(direccion : number = 1, columna: string = 'createdAt', data: any): Observable<any> {
    return this.http.post(`${base_url}/reportes/movimientos`, data, {
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }   
    });
  }

  // Cheques emitidos
  chequesEmitidos(direccion : number = 1, columna: string = 'createdAt',data: any): Observable<any> {
    return this.http.post(`${base_url}/reportes/cheques-emitidos`, data, {
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }   
    });
  }

  // Cheques emitidos
  saldos(direccion : number = 1, columna: string = 'createdAt', data: any): Observable<any> {
    return this.http.post(`${base_url}/reportes/saldos`, data, {
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }   
    });
  }

}
