import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ExternosService {

  constructor(private http: HttpClient) { }

    // Externo por ID
    getExterno(id: string): Observable<any>{
      return this.http.get(`${base_url}/externos/${id}`, {
        headers: { 'x-token': localStorage.getItem('token') }
      })
    } 
  
    // Listar externos
    listarExternos( direccion : number = 1, columna: string = 'descripcion' ): Observable<any>{
      return this.http.get(`${base_url}/externos`, {
        params: {
          direccion: String(direccion),
          columna              
        },
        headers: { 'x-token': localStorage.getItem('token') }      
      })
    }
  
    // Nuevo externo
    nuevoExterno(data: any): Observable<any>{
      return this.http.post(`${base_url}/externos`, data, {
        headers: { 'x-token': localStorage.getItem('token') }
      })  
    }
  
    // Actualizar externo
    actualizarExterno(id: string, data: any): Observable<any>{
      return this.http.put(`${base_url}/externos/${id}`, data, {
        headers: { 'x-token': localStorage.getItem('token') }  
      })
    }
  
}
