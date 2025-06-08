import { Routes } from '@angular/router';
import { RolComponent } from './components/rol/rol.component';
import { PermisoComponent } from './components/permiso/permiso.component';
import { TipoComponent } from './components/tipo/tipo.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { ProductoComponent } from './components/producto/producto.component';
import { RolPermisoComponent } from './components/rolpermiso/rolpermiso.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { NotaEntradaComponent } from './components/nota-entrada/nota-entrada.component';
import { DetalleNotaEntradaComponent } from './components/detalle-nota-entrada/detalle-nota-entrada.component';
import { CrearNotaEntradaComponent } from './components/crear-nota-entrada/crear-nota-entrada.component';

export const routes: Routes = [
    { path: 'roles', component: RolComponent },
    { path: 'permisos', component: PermisoComponent },
    { path: 'tipos', component: TipoComponent },
    { path: 'proveedores', component: ProveedorComponent },
    { path: 'productos', component: ProductoComponent },
    { path: 'rolpermisos', component: RolPermisoComponent },
    { path: 'usuarios', component: UsuarioComponent },
    { path: 'notas-entradas', component: NotaEntradaComponent },
    { path: 'detalle-notas-entradas', component: DetalleNotaEntradaComponent },
    { path: 'crear-notas-entradas', component: CrearNotaEntradaComponent },

    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '' },

];
