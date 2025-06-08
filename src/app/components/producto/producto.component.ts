import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { TipoService } from '../../services/tipo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './producto.component.html',
})
export class ProductoComponent implements OnInit {
  productos: any[] = [];
  tipos: any[] = [];

  modalAbierto = false;
  modoEdicion = false;
  productoEnEdicion: any = {};

  filtroNombre = '';
  filtroTipo = '';

  constructor(
    private productoService: ProductoService,
    private tipoService: TipoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.tipoService.listarTipos().subscribe((res: any) => {
      this.tipos = res.data.listarTipos;
    });
  }

  cargarProductos() {
    this.productoService.listarProductos().subscribe((res: any) => {
      this.productos = res.data.listarProductos;
    });
  }

  abrirModal(producto: any = null) {
    this.modalAbierto = true;
    this.modoEdicion = !!producto;
    this.productoEnEdicion = producto
      ? JSON.parse(JSON.stringify(producto))
      : {
          nombre: '',
          precioVenta: 0,
          stock: 0,
          descripcion: '',
          imagen: '',
          tipo: { id: 0 },
        };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  seleccionarImagen(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.productoService.subirImagen(file).subscribe((res: any) => {
      this.productoEnEdicion.imagen = res.path;
    });
  }

  guardarProducto() {
    const datos = {
      ...this.productoEnEdicion,
      tipoId: this.productoEnEdicion.tipo.id,
    };

    const accion = this.modoEdicion
      ? this.productoService.actualizarProducto(datos)
      : this.productoService.crearProducto(datos);

    accion.subscribe(() => {
      this.cerrarModal();
      this.cargarProductos();
    });
  }

  eliminarProducto(id: number) {
    this.productoService.eliminarProducto(id).subscribe(() => {
      this.cargarProductos();
    });
  }

  aplicarFiltros() {
    // Tu lógica de filtros si aplica
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroTipo = '';
  }
}
