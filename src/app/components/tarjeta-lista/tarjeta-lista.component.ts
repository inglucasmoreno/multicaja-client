import { Component, OnInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-tarjeta-lista',
  templateUrl: './tarjeta-lista.component.html',
  styles: [
  ]
})
export class TarjetaListaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    gsap.from(".gsap-contenido", { duration: 0.2, y: 100, opacity: 0.2 });
  }

}
