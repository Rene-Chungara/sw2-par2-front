import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './proveedor.component.html',
})
export class ProveedorComponent implements OnInit {
  proveedores: any[] = [];
  modalAbierto = false;
  modoEdicion = false;
  proveedorEnEdicion: any = {};

  constructor(private proveedorService: ProveedorService) {}

  ngOnInit(): void {
    this.proveedorService.listarProveedores().subscribe((res: any) => {
      this.proveedores = res.data.listarProveedores;
    });
  }

  abrirModal(proveedor: any = null) {
    this.modalAbierto = true;
    this.modoEdicion = !!proveedor;
    this.proveedorEnEdicion = proveedor
      ? JSON.parse(JSON.stringify(proveedor))
      : { nombre: '', origen: '' };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarProveedor() {
    if (this.modoEdicion) {
      this.proveedorService.actualizarProveedor(this.proveedorEnEdicion).subscribe(() => {
        this.cerrarModal();
      });
    } else {
      this.proveedorService.crearProveedor(
        this.proveedorEnEdicion.nombre,
        this.proveedorEnEdicion.origen
      ).subscribe(() => {
        this.cerrarModal();
      });
    }
  }

  eliminarProveedor(id: number) {
    this.proveedorService.eliminarProveedor(id).subscribe();
  }
}
