// rol.component.ts
import { Component, OnInit } from '@angular/core';
import { RolService } from '../../services/rol.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rol.component.html',
})
export class RolComponent implements OnInit {
  roles: any[] = [];
  nuevoRol: string = '';

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolService.obtenerRoles().subscribe((result: any) => {
      this.roles = result.data.listarRoles;
    });
  }

  crearRol() {
    if (!this.nuevoRol.trim()) return;

    this.rolService.crearRol(this.nuevoRol).subscribe(() => {
      this.nuevoRol = '';
      this.cargarRoles();
    });
  }

  eliminarRol(id: number) {
    this.rolService.eliminarRol(id).subscribe(() => {
      this.cargarRoles();
    });
  }
}
