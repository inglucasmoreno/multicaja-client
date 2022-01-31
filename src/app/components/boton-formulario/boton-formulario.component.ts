import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-boton-formulario',
  templateUrl: './boton-formulario.component.html',
  styles: [
  ]
})
export class BotonFormularioComponent implements OnInit {

  @Input() texto: string;
  @Input() deshabilitado: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
