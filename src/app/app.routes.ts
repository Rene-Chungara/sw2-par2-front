import { Routes } from '@angular/router';
import { RolComponent } from './components/rol/rol.component';
import { PermisoComponent } from './components/permiso/permiso.component';
import { TipoComponent } from './components/tipo/tipo.component';

export const routes: Routes = [
    { path: 'roles', component: RolComponent },
    { path: 'permisos', component: PermisoComponent },
    { path: 'tipos', component: TipoComponent },

    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '' },

];
