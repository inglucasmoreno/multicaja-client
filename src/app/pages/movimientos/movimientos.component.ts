import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from 'src/app/services/data.service';
import { MovimientosService } from '../../services/movimientos.service';
import { ExternosService } from '../../services/externos.service';
import { EmpresasService } from '../../services/empresas.service';
import { TipoMovimientos } from '../../models/tipo-movimientos.model';
import { TipoMovimientoService } from 'src/app/services/tipo-movimiento.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styles: [
  ]
})
export class MovimientosComponent implements OnInit {

  // Modal
  public showModal = false;
  public showModalCheque = false;
  public showModalDetalles = false;
  public flagEditando = false;
  
  // Tipos especiales
  public tipoCheque = '612fe410c2d42b3d98b6f17d';

  // Movimientos
  public idMovimiento = '';
  public movimientoSeleccionado: any = null;
  public movimientos: any[] = [];
  public total = 0;
  
  // Externos
  public externos: any[] = [];

  // Empresas
  public empresas: any[] = [];

  // Tipos de movimientos
  public tipos: TipoMovimientos[] = [];

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
    tipo_movimiento: '',
    origen_saldo: '',
    destino_saldo: '',
    monto: null
  }

  public cheque = {
    nro_cheque: '',
    concepto: '',
    cliente_descripcion: '',
    cliente: '',
    destino_descripcion: '',
    destino: '',
    emisor: '',
    cuit: '',
    monto: ''
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
    direccion: -1,  // Asc (1) | Desc (-1)
    columna: 'createdAt'
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
              private tipoMovimientosService: TipoMovimientoService,
              private externosService: ExternosService,
              private empresasService: EmpresasService,
              private alertService: AlertService,
              private dataService: DataService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = "Dashboard - Movimientos";
    this.listarMovimientos();
    this.listarExternos();
    this.listadoEmpresas();
    this.listarTipos();
  }

  // Listar tipos de movimientos
  listarTipos(): void {
    this.tipoMovimientosService.listarTipos().subscribe( ({ tipos }) => {
      this.tipos= tipos.filter( tipo => tipo.activo );
    });
  };
  
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
  actualizarElemento(origen_destino: string, id: string, otro: any){
    if(id !== ''){
      if(this.data.tipo_origen === 'Interno' && origen_destino === 'Origen' || this.data.tipo_destino === 'Interno' && origen_destino === 'Destino'){
        this.alertService.loading();
        this.empresasService.listarSaldos(1,'descripcion',id).subscribe(({ saldos }) => {
          if(origen_destino === 'Origen'){  // Origen
            this.data.origen_saldo = '';
            this.saldos_origen = saldos.filter( saldo => (saldo.activo == true) ); 
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
      this.externos = externos.filter( externo => (externo.activo == true) );
      this.elementosOrigen = this.externos;
      this.elementosDestino = this.externos;
    },({error})=>{
      this.alertService.errorApi(error);
    });
  }

  // Listado de empresas
  listadoEmpresas(): void {
    this.empresasService.listarEmpresas().subscribe(({ empresas })=> {
      this.empresas = empresas.filter( empresa => (empresa.activo == true) );
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
    
    if(this.data.tipo_movimiento === this.tipoCheque){ // Abrir modal - CHEQUE
      this.showModal = false;
      this.showModalCheque = true;
    }else{ // Crear nuevo movimiento
      this.alertService.loading();
      this.movimientosService.nuevoMovimiento(this.data).subscribe(()=>{
        this.listarMovimientos();
        this.reiniciarFormulario();
        this.showModal = false;
        this.alertService.close();
      },({error})=>{
        this.alertService.errorApi(error);
      });      
    }

  }
    
  // Reiniciar formulario
  reiniciarFormulario(): void {
    this.data = {
      descripcion: 'Testing',
      monto: null,     
      tipo_origen: 'Externo',
      tipo_destino: 'Externo',
      tipo_movimiento: '',
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

  // Abrir modal detalles
  abrirModalDetalles(id: string): void {
    this.alertService.loading();
    this.movimientosService.getMovimiento(id).subscribe(({ movimiento }) => {
      this.movimientoSeleccionado = movimiento;
      console.log(this.movimientoSeleccionado);
      this.alertService.close();
    });
    this.showModalDetalles = true;  
  }  

  // Regresar al modal - Nuevo tipo
  regresar(): void {
    this.showModalCheque = false;
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
