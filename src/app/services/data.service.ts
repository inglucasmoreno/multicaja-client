import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  ubicacionActual: string = 'Dashboard';
  
  constructor() { }
  
}
