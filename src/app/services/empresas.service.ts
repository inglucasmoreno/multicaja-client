import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private http: HttpClient) {}
  
  // Empresa por ID
  getEmpresa(id: string): Observable<any>{
    return this.http.get(`${base_url}/empresas/${id}`, {
      headers: { 'x-token': localStorage.getItem('token') }
    })
  } 

  // Listar empresas
  listarEmpresas( direccion : number = 1, columna: string = 'createdAt' ): Observable<any>{
    return this.http.get(`${base_url}/empresas`, {
      params: {
        direccion: String(direccion),
        columna              
      },
      headers: { 'x-token': localStorage.getItem('token') }      
    })
  }

  // Nueva empresa
  nuevaEmpresa(data: any): Observable<any>{
    return this.http.post(`${base_url}/empresas`, data, {
      headers: { 'x-token': localStorage.getItem('token') }
    })  
  }

  // Actualizar empresa
  actualizarEmpresa(id: string, data: any): Observable<any>{
    return this.http.put(`${base_url}/empresas/${id}`, data, {
      headers: { 'x-token': localStorage.getItem('token') }  
    })
  }

}
