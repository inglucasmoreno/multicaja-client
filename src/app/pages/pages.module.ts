import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmpresasComponent } from './empresas/empresas.component';
import { ExternosComponent } from './externos/externos.component';
import { SaldosComponent } from './empresas/saldos.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { TipoMovimientosComponent } from './tipo-movimientos/tipo-movimientos.component';
import { CarteraChequesComponent } from './cartera-cheques/cartera-cheques.component';
import { ChequesEmitidosComponent } from './cheques-emitidos/cheques-emitidos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ReportesMovimientosComponent } from './reportes/reportes-movimientos.component';
import { ReportesChequesEmitidosComponent } from './reportes/reportes-cheques-emitidos.component';
import { ReportesEvolucionSaldosComponent } from './reportes/reportes-evolucion-saldos.component';
import { CentrosCostosComponent } from './centros-costos/centros-costos.component';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component';


@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    UsuariosComponent,
    NuevoUsuarioComponent,
    EditarUsuarioComponent,
    EditarPasswordComponent,
    EmpresasComponent,
    ExternosComponent,
    SaldosComponent,
    MovimientosComponent,
    TipoMovimientosComponent,
    CarteraChequesComponent,
    ChequesEmitidosComponent,
    ReportesComponent,
    ReportesMovimientosComponent,
    ReportesChequesEmitidosComponent,
    ReportesEvolucionSaldosComponent,
    CentrosCostosComponent,
    CuentasContablesComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class PagesModule { }
