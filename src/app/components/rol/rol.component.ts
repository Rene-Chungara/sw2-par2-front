import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RolService, Rol } from '../../services/rol.service';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './rol.component.html'
})
export class RolComponent implements OnInit {
  roles: Rol[] = [];
  nuevoRol: string = '';

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.obtenerRoles();
  }

  obtenerRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error al obtener roles', err);
      }
    });
  }

  crearRol(): void {
    const nombre = this.nuevoRol.trim();
    if (nombre) {
      this.rolService.createRol(nombre).subscribe({
        next: () => {
          this.nuevoRol = '';
          this.obtenerRoles();
        },
        error: (err) => {
          console.error('Error al crear rol', err);
        }
      });
    }
  }

  eliminarRol(id: number): void {
    this.rolService.deleteRol(id).subscribe({
      next: () => {
        this.obtenerRoles();
      },
      error: (err) => {
        console.error('Error al eliminar rol', err);
      }
    });
  }
}
