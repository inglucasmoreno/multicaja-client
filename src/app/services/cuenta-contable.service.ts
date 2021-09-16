import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CuentaContableService {

  constructor(private http: HttpClient) { }
  
    // Cuenta contable por ID
    getCuentaContable(id: string): Observable<any>{
      return this.http.get(`${base_url}/cuenta-contable/${id}`, {
        headers: { 'x-token': localStorage.getItem('token') }
      })
    } 
  
    // Listar cuentas contables
    listarCuentasContables( direccion : number = 1, columna: string = 'descripcion' ): Observable<any>{
      return this.http.get(`${base_url}/cuenta-contable`, {
        params: {
          direccion: String(direccion),
          columna              
        },
        headers: { 'x-token': localStorage.getItem('token') }      
      })
    }
  
    // Nueva cuenta contable
    nuevaCuentaContable(data: any): Observable<any>{
      return this.http.post(`${base_url}/cuenta-contable`, data, {
        headers: { 'x-token': localStorage.getItem('token') }
      })  
    }
  
    // Actualizar cuenta contable
    actualizarCuentaContable(id: string, data: any): Observable<any>{
      return this.http.put(`${base_url}/cuenta-contable/${id}`, data, {
        headers: { 'x-token': localStorage.getItem('token') }  
      })
    }

}
