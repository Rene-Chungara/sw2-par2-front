import { Routes } from '@angular/router';
import { RolComponent } from './components/rol/rol.component';
import { PermisoComponent } from './components/permiso/permiso.component';

export const routes: Routes = [
    { path: 'roles', component: RolComponent },
    { path: 'permisos', component: PermisoComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '**', redirectTo: '' },

];
