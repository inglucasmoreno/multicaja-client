import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class MovimientosService {

  constructor(private http: HttpClient) {}

  // Movimiento por ID
  getMovimiento(id: string): Observable<any> {
    return this.http.get(`${base_url}/movimientos/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }   
    });
  }

  // Nuevo movimiento
  nuevoMovimiento(data: any): Observable<any>{
    return this.http.post(`${base_url}/movimientos`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    });  
  };

  // Listar externos
  listarMovimientos( direccion : number = 1, columna: string = 'createdAt' ): Observable<any>{
    return this.http.get(`${base_url}/movimientos`, {
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }      
    });
  };

}
