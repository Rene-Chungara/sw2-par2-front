// permiso.component.ts
import { Component, OnInit } from '@angular/core';
import { PermisoService } from '../../services/permiso.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permiso',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './permiso.component.html',
})
export class PermisoComponent implements OnInit {
  permisos: any[] = [];
  nuevoPermiso: string = '';

  constructor(private permisoService: PermisoService) {}

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos() {
    this.permisoService.obtenerPermisos().subscribe((result: any) => {
      this.permisos = result.data.listarPermisos;
    });
  }

  crearPermiso() {
    if (!this.nuevoPermiso.trim()) return;

    this.permisoService.crearPermiso(this.nuevoPermiso).subscribe(() => {
      this.nuevoPermiso = '';
      this.cargarPermisos();
    });
  }

  eliminarPermiso(id: number) {
    this.permisoService.eliminarPermiso(id).subscribe(() => {
      this.cargarPermisos();
    });
  }
}
