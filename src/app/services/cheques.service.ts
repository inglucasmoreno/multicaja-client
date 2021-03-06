import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ChequesService {

  constructor(private http: HttpClient) { }

  // Cheques por ID
  getCheques(id: string): Observable<any>{
    return this.http.get(`${base_url}/cheques/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }
    })
  } 

  // Listar cheques
  listarCheques(id: string, direccion : number = 1, columna: string = 'createdAt', activo: string, estado: string ): Observable<any>{
    return this.http.get(`${base_url}/cheques/cartera/${id}`, {
      params: {
        activo,
        estado,
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }      
    })
  }

  // Listar cheques
  listarChequesEmitidos(id: string, direccion : number = 1, columna: string = 'createdAt', activo: string, estado: string ): Observable<any>{
    return this.http.get(`${base_url}/cheques/listar/emitidos/${id}`, {
      params: {
        activo,
        estado,
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }      
    })
  }

  // Nuevo cheque
  nuevoCheque(data: any): Observable<any>{
    return this.http.post(`${base_url}/cheques`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })  
  }

  // Cheque emitido cobrado
  emitidoCobrado(data: any): Observable<any>{
    return this.http.post(`${base_url}/cheques/emitido/cobrado`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })  
  }

  // Nuevo cheque desde cartera
  nuevoChequeDesdeCartera(data: any): Observable<any>{
    return this.http.post(`${base_url}/cheques/crear`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })  
  }

  // Emitir cheque
  emitirCheque(data: any): Observable<any>{
    return this.http.post(`${base_url}/cheques/emitir`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })  
  }

  // Actualizar cheque
  actualizarCheque(id: string, data: any): Observable<any>{
    return this.http.put(`${base_url}/cheques/${id}`, data, {
      headers: { 'x-token': localStorage.getItem('token') }  
    })
  }


}
