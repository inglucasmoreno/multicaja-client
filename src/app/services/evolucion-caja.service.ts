import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EvolucionCajaService {

  constructor(private http: HttpClient) { }

  // Evolucion de caja por ID
  getEvolucionCaja(id: string): Observable<any>{
    return this.http.get(`${base_url}/evolucion-caja/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }
    })
  } 

  // Listar evolucion de caja
  listarEvolucionCaja( direccion : number = 1, columna: string = 'descripcion' ): Observable<any>{
    return this.http.get(`${base_url}/evolucion-caja`, {
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }      
    })
  }

  // Nueva evolucion de caja
  nuevaEvolucionCaja(data: any): Observable<any>{
    return this.http.post(`${base_url}/evolucion-caja`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })  
  }
  
}
