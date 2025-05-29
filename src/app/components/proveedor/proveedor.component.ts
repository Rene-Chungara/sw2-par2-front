import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './proveedor.component.html'
})
export class ProveedorComponent implements OnInit {
  proveedores: Proveedor[] = [];
  modalAbierto = false;
  modoEdicion = false;
  proveedorEnEdicion: Proveedor | null = null;

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => this.proveedores = data.sort((a, b) => a.id - b.id),
      error: (err) => console.error('Error al obtener proveedores', err)
    });
  }

  abrirModal(proveedor?: Proveedor): void {
    this.modalAbierto = true;
    if (proveedor) {
      this.modoEdicion = true;
      this.proveedorEnEdicion = { ...proveedor };
    } else {
      this.modoEdicion = false;
      this.proveedorEnEdicion = { id: 0, nombre: '', origen: '' };
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.proveedorEnEdicion = null;
  }

  guardarProveedor(): void {
    if (!this.proveedorEnEdicion) return;

    const data = {
      nombre: this.proveedorEnEdicion.nombre.trim(),
      origen: this.proveedorEnEdicion.origen.trim()
    };

    if (this.modoEdicion && this.proveedorEnEdicion.id) {
      this.proveedorService.updateProveedor(this.proveedorEnEdicion.id, data).subscribe(() => {
        this.obtenerProveedores();
        this.cerrarModal();
      });
    } else {
      this.proveedorService.createProveedor(data).subscribe(() => {
        this.obtenerProveedores();
        this.cerrarModal();
      });
    }
  }

  eliminarProveedor(id: number): void {
    this.proveedorService.deleteProveedor(id).subscribe(() => {
      this.obtenerProveedores();
    });
  }

  // ----------FILTRO ---------------
  filtroNombre = '';
  filtroOrigen = '';

  aplicarFiltros(): void {
    if (this.filtroNombre.trim()) {
      this.proveedorService.buscarPorNombre(this.filtroNombre.trim()).subscribe({
        next: (data) => this.proveedores = data.sort((a, b) => a.id - b.id),
        error: (err) => console.error('Error al buscar por nombre', err)
      });
    } else if (this.filtroOrigen.trim()) {
      this.proveedorService.buscarPorOrigen(this.filtroOrigen.trim()).subscribe({
        next: (data) => this.proveedores = data.sort((a, b) => a.id - b.id),
        error: (err) => console.error('Error al buscar por origen', err)
      });
    } else {
      this.obtenerProveedores();
    }
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroOrigen = '';
    this.obtenerProveedores();
  }
  
}
