import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CentroCostosService {

  constructor(private http:HttpClient) { }

    // Centro de costo por ID
    getCentroCosto(id: string): Observable<any>{
      return this.http.get(`${base_url}/centro-costos/${id}`, {
        headers: { 'x-token': localStorage.getItem('token') }
      })
    } 
  
    // Listar centros de costos
    listarCentrosCostos( direccion : number = 1, columna: string = 'descripcion' ): Observable<any>{
      return this.http.get(`${base_url}/centro-costos`, {
        params: {
          direccion: String(direccion),
          columna              
        },
        headers: { 'x-token': localStorage.getItem('token') }      
      })
    }
  
    // Nuevo centro de costos
    nuevoCentroCostos(data: any): Observable<any>{
      return this.http.post(`${base_url}/centro-costos`, data, {
        headers: { 'x-token': localStorage.getItem('token') }
      })  
    }
  
    // Actualizar centro de costos
    actualizarCentroCostos(id: string, data: any): Observable<any>{
      return this.http.put(`${base_url}/centro-costos/${id}`, data, {
        headers: { 'x-token': localStorage.getItem('token') }  
      })
    }

}
