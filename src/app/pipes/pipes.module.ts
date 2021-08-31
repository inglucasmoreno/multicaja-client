import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaPipe } from './fecha.pipe';
import { RolPipe } from './rol.pipe';
import { MonedaPipe } from './moneda.pipe';
import { FiltroUsuariosPipe } from './filtro-usuarios.pipe';
import { FiltroEmpresasPipe } from './filtro-empresas.pipe';
import { FiltroExternosPipe } from './filtro-externos.pipe';
import { FiltroSaldosPipe } from './filtro-saldos.pipe';
import { FiltroTipoMovimientoPipe } from './filtro-tipo-movimiento.pipe';

@NgModule({
  declarations: [
    FechaPipe,
    RolPipe,
    MonedaPipe,
    FiltroUsuariosPipe,
    FiltroEmpresasPipe,
    FiltroExternosPipe,
    FiltroSaldosPipe,
    FiltroTipoMovimientoPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FechaPipe,
    RolPipe,
    MonedaPipe,
    FiltroUsuariosPipe,
    FiltroEmpresasPipe,
    FiltroExternosPipe,
    FiltroSaldosPipe,
    FiltroTipoMovimientoPipe,
  ]
})
export class PipesModule { }
