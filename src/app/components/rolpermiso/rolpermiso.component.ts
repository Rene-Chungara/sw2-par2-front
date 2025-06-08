// rolpermiso.component.ts
import { Component, OnInit } from '@angular/core';
import { RolPermisoService } from '../../services/rolpermiso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RolService } from '../../services/rol.service';
import { PermisoService } from '../../services/permiso.service';


@Component({
  selector: 'app-rolpermiso',
  standalone: true,  
  imports: [FormsModule, CommonModule],
  
  templateUrl: './rolpermiso.component.html',
})
export class RolPermisoComponent implements OnInit {
  rolPermisos: any[] = [];
  rolSeleccionado: number = 0;
  permisoSeleccionado: number = 0;
  roles: any[] = [];
  permisos: any[] = [];

  constructor(
    private rolPermisoService: RolPermisoService,
    private rolService: RolService,
    private permisoService: PermisoService
  ) {}

  ngOnInit(): void {
    this.cargarRolPermisos();
    this.cargarRoles();
    this.cargarPermisos();
  }

  cargarRolPermisos() {
    this.rolPermisoService.listarRolPermiso().subscribe((result: any) => {
      this.rolPermisos = result.data.listarRolPermisos;
    });
  }

  cargarRoles() {
    this.rolService.obtenerRoles().subscribe((result: any) => {
      this.roles = result.data.listarRoles;
    });
  }

  cargarPermisos() {
    this.permisoService.obtenerPermisos().subscribe((result: any) => {
      this.permisos = result.data.listarPermisos;
    });
  }
  agregarRolPermiso() {
    if (!this.rolSeleccionado || !this.permisoSeleccionado) return;

    this.rolPermisoService
      .crearRolPermiso(this.rolSeleccionado, this.permisoSeleccionado)
      .subscribe(() => {
        this.cargarRolPermisos();
      });
  }

  eliminarRolPermiso(id: number) {
    this.rolPermisoService.eliminarRolPermiso(id).subscribe(() => {
      this.cargarRolPermisos();
    });
  }
}
