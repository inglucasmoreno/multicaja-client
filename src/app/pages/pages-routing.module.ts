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
            
            // Empresas
            { path: 'empresas', canActivate: [AdminGuard], component: EmpresasComponent },
            { path: 'empresas/saldos/:id', canActivate: [AdminGuard], component: SaldosComponent },

            // Cheques
            { path: 'cheques/cartera/:id', canActivate: [AdminGuard], component: CarteraChequesComponent },
                
            // Externos
            { path: 'externos', canActivate: [AdminGuard], component: ExternosComponent },
            
            // Movimientos
            { path: 'movimientos', canActivate: [AdminGuard], component: MovimientosComponent },

            // Tipos de movimientos
            { path: 'tipo-movimientos', canActivate: [AdminGuard], component:  TipoMovimientosComponent},

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}