import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PermisoService, Permiso } from '../../services/permiso.service';

@Component({
  selector: 'app-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './permiso.component.html'
})
export class PermisoComponent implements OnInit {
  permisos: Permiso[] = [];
  nuevoPermiso: string = '';

  constructor(private permisoService: PermisoService) {}

  ngOnInit(): void {
    this.obtenerPermisos();
  }

  obtenerPermisos(): void {
    this.permisoService.getPermisos().subscribe({
      next: (data) => (this.permisos = data),
      error: (err) => console.error('Error al obtener permisos', err)
    });
  }

  crearPermiso(): void {
    const nombre = this.nuevoPermiso.trim();
    if (nombre) {
      this.permisoService.createPermiso(nombre).subscribe({
        next: () => {
          this.nuevoPermiso = '';
          this.obtenerPermisos();
        },
        error: (err) => console.error('Error al crear permiso', err)
      });
    }
  }

  eliminarPermiso(id: number): void {
    this.permisoService.deletePermiso(id).subscribe({
      next: () => this.obtenerPermisos(),
      error: (err) => console.error('Error al eliminar permiso', err)
    });
  }
}
