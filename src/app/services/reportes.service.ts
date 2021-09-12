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
  movimientos(data: any): Observable<any> {
    return this.http.post(`${base_url}/reportes/movimientos`, data, {
      headers: { 'x-token': localStorage.getItem('token') }   
    });
  }

  // Cheques emitidos
  chequesEmitidos(data: any): Observable<any> {
    return this.http.post(`${base_url}/reportes/cheques-emitidos`, data, {
      headers: { 'x-token': localStorage.getItem('token') }   
    });
  }

}
