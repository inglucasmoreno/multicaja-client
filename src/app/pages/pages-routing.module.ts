import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

// Componentes
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { ExternosComponent } from './externos/externos.component';
import { SaldosComponent } from './empresas/saldos.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { TipoMovimientosComponent } from './tipo-movimientos/tipo-movimientos.component';
import { CarteraChequesComponent } from './cartera-cheques/cartera-cheques.component';
import { ChequesEmitidosComponent } from './cheques-emitidos/cheques-emitidos.component';
import { ReportesChequesEmitidosComponent } from './reportes/reportes-cheques-emitidos.component';
import { ReportesMovimientosComponent } from './reportes/reportes-movimientos.component';
import { ReportesEvolucionSaldosComponent } from './reportes/reportes-evolucion-saldos.component';
import { CentrosCostosComponent } from './centros-costos/centros-costos.component';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component';
import { CobrarChequeComponent } from './alertas/cobrar-cheque.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            
            // Home
            { path: 'home', component: HomeComponent },

            // Usuarios
            { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent },
            { path: 'usuarios/nuevo', canActivate: [AdminGuard], component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', canActivate: [AdminGuard], component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', canActivate: [AdminGuard], component: EditarPasswordComponent },
            
            // Perfil de usuario
            { path: 'perfil', component: PerfilComponent },

            // Empresas
            { path: 'empresas', component: EmpresasComponent },
            { path: 'empresas/saldos/:id', component: SaldosComponent },

            // Cheques
            { path: 'cheques/cartera/:id', component: CarteraChequesComponent },
            { path: 'cheques/emitidos/:id', component: ChequesEmitidosComponent },
                
            // Externos
            { path: 'externos', canActivate: [AdminGuard], component: ExternosComponent },
            
            // Movimientos
            { path: 'movimientos', canActivate: [AdminGuard], component: MovimientosComponent },

            // Tipos de movimientos
            { path: 'tipo-movimientos', canActivate: [AdminGuard], component:  TipoMovimientosComponent},
            
            // Centro de costos
            { path: 'centros-costos', canActivate: [AdminGuard], component:  CentrosCostosComponent},

            // Cuentas contables
            { path: 'cuentas-contables', canActivate: [AdminGuard], component: CuentasContablesComponent},

            // Reportes
            { path: 'reportes/movimientos', component:  ReportesMovimientosComponent},
            { path: 'reportes/cheques-emitidos', component:  ReportesChequesEmitidosComponent},
            { path: 'reportes/evolucion-saldos', component:  ReportesEvolucionSaldosComponent},

            
            // Alertas
            { path: 'alertas/cobrar-cheques', component: CobrarChequeComponent},

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}