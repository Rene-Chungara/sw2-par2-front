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
import { VentaComponent } from './components/venta/venta.component';
import { CrearVentaComponent } from './components/crear-venta/crear-venta.component';
import { VentaDetalleComponent } from './components/venta-detalle/venta-detalle.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MlTesterComponent } from './components/ml-tester/ml-tester.component';
import { ReporteVentasTipoComponent } from './components/reporte-ventas-tipo/reporte-ventas-tipo.component';
import { BiDashboardComponent } from './components/bi-dashboard/bi-dashboard.component'; 

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'roles', component: RolComponent },
    { path: 'permisos', component: PermisoComponent },
    { path: 'tipos', component: TipoComponent },
    { path: 'machine', component: MlTesterComponent },
    { path: 'proveedores', component: ProveedorComponent },
    { path: 'productos', component: ProductoComponent },
    { path: 'rolpermisos', component: RolPermisoComponent },
    { path: 'usuarios', component: UsuarioComponent },
    { path: 'notas-entradas', component: NotaEntradaComponent },
    { path: 'detalle-nota-entrada/:id', component: DetalleNotaEntradaComponent },
    { path: 'crear-notas-entradas', component: CrearNotaEntradaComponent },
    { path: 'ventas', component: VentaComponent },
    { path: 'crear-venta', component: CrearVentaComponent },
    { path: 'detalle-venta/:id', component: VentaDetalleComponent  },
    { path: 'reportes', component: ReporteVentasTipoComponent },
    { path: 'dashboard-bi', component: BiDashboardComponent },


    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '' },

];
