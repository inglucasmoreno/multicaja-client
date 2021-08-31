import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TipoMovimientoService {

  constructor(private http:HttpClient) { }

    // tipo por ID
    getTipo(id: string): Observable<any>{
      return this.http.get(`${base_url}/tipo-movimientos/${id}`, {
        headers: { 'x-token': localStorage.getItem('token') }
      });
    }; 
  
    // Listar tipos
    listarTipos( direccion : number = 1, columna: string = 'descripcion' ): Observable<any>{
      return this.http.get(`${base_url}/tipo-movimientos`, {
        params: {
          direccion: String(direccion),
          columna              
        },
        headers: { 'x-token': localStorage.getItem('token') }      
      });
    };
  
    // Nuevo tipo
    nuevoTipo(data: any): Observable<any>{
      return this.http.post(`${base_url}/tipo-movimientos`, data, {
        headers: { 'x-token': localStorage.getItem('token') }
      });  
    };
  
    // Actualizar tipo
    actualizarTipo(id: string, data: any): Observable<any>{
      return this.http.put(`${base_url}/tipo-movimientos/${id}`, data, {
        headers: { 'x-token': localStorage.getItem('token') }  
      });
    };

}
