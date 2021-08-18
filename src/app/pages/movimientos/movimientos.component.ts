import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { MovimientosService } from '../../services/movimientos.service';
import { ExternosService } from '../../services/externos.service';
import { EmpresasService } from '../../services/empresas.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styles: [
  ]
})
export class MovimientosComponent implements OnInit {

  // Modal
  public showModal = false;
  public flagEditando = false;
  
  // Movimientos
  public idMovimiento = '';
  public movimientos: any[] = [];
  public total = 0;
  
  // Externos
  public externos: any[] = [];

  // Empresas
  public empresas: any[] = [];

  // Elementos origen
  public elementosOrigen: any[] = [];

  // Elemento destino
  public elementosDestino: any[] = [];

  // Saldos
  public saldos_origen: any [] = [];
  public saldos_destino: any[] = [];

  // Data
  public data = {
    descripcion: 'Testing',
    tipo_origen: 'Externo',
    tipo_destino: 'Externo',
    origen: '',
    destino: '',
    origen_saldo: '',
    destino_saldo: '',
    monto: null
  }

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;
  
  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }
  
  // Ordenar
  public ordenar = {
    direccion: 1,  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }
  
  // Modelo reactivo
  public movimientoForm = this.fb.group({
    descripcion: ['', Validators.required],
    dni_cuit: '',
    telefono: '',
    direccion: '',
    activo: [true, Validators.required],
  });
  
  constructor(private movimientosService: MovimientosService,
              private externosService: ExternosService,
              private empresasService: EmpresasService,
              private alertService: AlertService,
              private dataService: DataService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Movimientos";
    console.log(this.data.tipo_origen);
    this.listarMovimientos();
    this.listarExternos();
    this.listadoEmpresas();
  }
  
  // Actualizar selectores
  actualizarTipo(origen_destino: string, tipo: string ): void {
    if(origen_destino === 'Origen'){  // Origen
      this.data.origen = '';
      this.data.origen_saldo = '';
      if(tipo == 'Interno'){          // Origen - Interno
        this.elementosOrigen = this.empresas;
      }else{                          // Origen - Externo
        this.elementosOrigen = this.externos;
      }
    }else{                            // Destino
      this.data.destino = '';
      this.data.destino_saldo = '';
      if(tipo == 'Interno'){          // Destino - Interno
        this.elementosDestino = this.empresas;
      }else{                          // Destino - Externo
        this.elementosDestino = this.externos;
      }
    }
  }

  // Actualizacion de saldos
  actualizarElemento(origen_destino: string, id: string){
    if(id !== ''){
      if(this.data.tipo_origen === 'Interno' && origen_destino === 'Origen' || this.data.tipo_destino === 'Interno' && origen_destino === 'Destino'){
        this.alertService.loading();
        this.empresasService.listarSaldos(1,'descripcion',id).subscribe(({ saldos }) => {
          if(origen_destino === 'Origen'){  // Origen
            this.data.origen_saldo = '';
            this.saldos_origen = saldos; 
          }else{                            // Destino
            this.data.destino_saldo = '';
            this.saldos_destino = saldos; 
          }
          this.alertService.close();
        })
      }
    }    
  }

  // Listado de movimientos
  listarMovimientos(): void {
    this.alertService.loading();
    this.movimientosService.listarMovimientos(
      this.ordenar.direccion,
      this.ordenar.columna
    ).subscribe(({ movimientos, total }) => {
      console.log(movimientos);
      this.movimientos = movimientos;
      this.total = total;
      this.alertService.close();
    }, ({ error }) => {
      this.alertService.errorApi(error);  
    });
  }

  // Listado de agentes externos
  listarExternos(): void {
    this.externosService.listarExternos().subscribe(({ externos }) => {
      this.externos = externos;
      this.elementosOrigen = externos;
      this.elementosDestino = externos;
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Listado de empresas
  listadoEmpresas(): void {
    this.empresasService.listarEmpresas().subscribe(({ empresas })=> {
      this.empresas = empresas;
    },({error})=>{
      this.alertService.errorApi(error);  
    });
  };

  // Crear movimiento
  crearMovimiento(): void {
    const verificacion = this.data.monto === null || 
                         this.data.monto < 0 ||
                         this.data.origen.trim() === '' ||
                         this.data.destino.trim() === '' ||
                         this.data.tipo_origen === 'Interno' && this.data.origen_saldo === '' ||
                         this.data.tipo_destino === 'Interno' && this.data.destino_saldo === ''

    if(verificacion) return this.alertService.formularioInvalido();
    
    this.alertService.loading();

    this.movimientosService.nuevoMovimiento(this.data).subscribe(resp=>{
      this.listarMovimientos();
      this.reiniciarFormulario();
      this.showModal = false;
      this.alertService.close();
    },({error})=>{
      this.alertService.errorApi(error);
    });

  }
    
  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.data = {
      descripcion: 'Testing',
      monto: null,     
      tipo_origen: 'Externo',
      tipo_destino: 'Externo',
      origen: '',
      destino: '',
      origen_saldo: '',
      destino_saldo: '',
    }
    this.saldos_origen = [];
    this.saldos_destino = [];
  };

  // Abrir modal
  abrirModal(): void {
    this.reiniciarFormulario();
    this.showModal = true;
  }
    
  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void{
    this.filtro.activo = activo;
  }
  
  // Filtrar por Parametro
  filtrarParametro(parametro: string): void{
    this.filtro.parametro = parametro;
  }
  
  // Ordenar por columna
  ordenarPorColumna(columna: string){
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 1 ? -1 : 1; 
    this.alertService.loading();
    this.listarMovimientos();
  }
  
}
