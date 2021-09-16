import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {
  
  constructor(private dataService: DataService) { }
  
  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Home';
  }
  
  vamosRiver(): void {
    alert('Vamos River!!!');
  }
}
