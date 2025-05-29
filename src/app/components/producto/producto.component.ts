import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { TipoService, Tipo } from '../../services/tipo.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './producto.component.html'
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  tipos: Tipo[] = [];

  modalAbierto = false;
  modoEdicion = false;
  productoEnEdicion: Producto | null = null;
  imagenSeleccionada: File | null = null;

  constructor(
    private productoService: ProductoService,
    private tipoService: TipoService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerTipos();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe({
      next: data => this.productos = data.sort((a, b) => a.id - b.id),
      error: err => console.error('Error al obtener productos', err)
    });
  }

  obtenerTipos(): void {
    this.tipoService.getTipos().subscribe({
      next: data => this.tipos = data,
      error: err => console.error('Error al obtener tipos', err)
    });
  }

  abrirModal(producto?: Producto): void {
    this.modalAbierto = true;
    if (producto) {
      this.modoEdicion = true;
      this.productoEnEdicion = { ...producto };
    } else {
      this.modoEdicion = false;
      this.productoEnEdicion = {
        id: null as any,
        nombre: '',
        descripcion: '',
        precioVenta: 0,
        stock: 0,
        imagen: '',
        tipo: { id: 0, nombre: ''}
      };
    }
    this.imagenSeleccionada = null;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.productoEnEdicion = null;
    this.imagenSeleccionada = null;
  }

  seleccionarImagen(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  guardarProducto(): void {
    if (!this.productoEnEdicion) return;

    const ejecutarGuardar = () => {
      const data = {
        ...this.productoEnEdicion,
        tipo: { id: this.productoEnEdicion!.tipo.id } // solo ID
      };

      const llamada = this.modoEdicion
        ? this.productoService.updateProducto(this.productoEnEdicion!.id, data)
        : this.productoService.createProducto(data);

      llamada.subscribe({
        next: () => {
          this.obtenerProductos();
          this.cerrarModal();
        },
        error: (err) => console.error('Error al guardar producto', err)
      });
    };

    if (this.imagenSeleccionada) {
      this.productoService.uploadImagen(this.imagenSeleccionada).subscribe({
        next: res => {
          this.productoEnEdicion!.imagen = res.ruta;
          ejecutarGuardar();
        },
        error: err => {
          console.error('Error al subir imagen', err);
        }
      });
    } else {
      ejecutarGuardar();
    }
  }

  eliminarProducto(id: number): void {
    this.productoService.deleteProducto(id).subscribe(() => {
      this.obtenerProductos();
    });
  }

  filtroNombre = '';
  filtroTipo = '';
  aplicarFiltros(): void {
    if (this.filtroNombre.trim()) {
      this.productoService.buscarPorNombre(this.filtroNombre.trim()).subscribe({
        next: data => this.productos = data.sort((a, b) => a.id - b.id),
        error: err => console.error('Error al buscar por nombre', err)
      });
    } else if (this.filtroTipo.trim()) {
      this.productoService.buscarPorTipo(this.filtroTipo.trim()).subscribe({
        next: data => this.productos = data.sort((a, b) => a.id - b.id),
        error: err => console.error('Error al buscar por tipo', err)
      });
    } else {
      this.obtenerProductos();
    }
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroTipo = '';
    this.obtenerProductos();
  }

  imagenPrevia(): string {
    return this.imagenSeleccionada ? URL.createObjectURL(this.imagenSeleccionada) : '';
  }

  quitarImagen(): void {
    this.imagenSeleccionada = null;
    if (this.productoEnEdicion) {
      this.productoEnEdicion.imagen = '';
    }
  }
}
