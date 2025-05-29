import { Routes } from '@angular/router';
import { RolComponent } from './components/rol/rol.component';

export const routes: Routes = [
    { path: 'roles', component: RolComponent },
    { path: '', redirectTo: 'roles', pathMatch: 'full' },
    { path: '**', redirectTo: 'roles' }
];
