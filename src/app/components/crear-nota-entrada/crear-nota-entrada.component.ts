import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotaEntradaService } from '../../services/nota-entrada.service';
import { ProveedorService } from '../../services/proveedor.service';
import { ProductoService } from '../../services/producto.service';
import { DetalleNotaEntradaService } from '../../services/detalle-nota-entrada.service';

@Component({
  selector: 'app-crear-nota-entrada',
  standalone: true,
  templateUrl: './crear-nota-entrada.component.html',
  imports: [CommonModule, FormsModule],
})
export class CrearNotaEntradaComponent {
  fecha = '';
  lote = '';
  proveedorId = '';
  proveedores: any[] = [];
  productos: any[] = [];

  detalles: any[] = [];
  nuevoDetalle = {
    productoId: '',
    cantidad: 1,
    costoUnitario: 0,
  };

  mensajeExito = '';
  guardando = false;

  constructor(
    private notaService: NotaEntradaService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private detalleService: DetalleNotaEntradaService
  ) {}

  ngOnInit(): void {
    this.proveedorService.obtenerProveedores().subscribe((res: any) => {
      this.proveedores = res.data.listarProveedores;
    });

    this.productoService.listarProductos().subscribe((res: any) => {
      this.productos = res.data.listarProductos;
    });
  }

  get costoTotal(): number {
    return this.detalles.reduce((sum, d) => sum + d.cantidad * d.costoUnitario, 0);
  }

  agregarDetalle() {
    if (!this.nuevoDetalle.productoId || this.nuevoDetalle.cantidad <= 0) return;

    this.detalles.push({ ...this.nuevoDetalle });
    this.nuevoDetalle = { productoId: '', cantidad: 1, costoUnitario: 0 };
  }

  eliminarDetalle(index: number) {
    this.detalles.splice(index, 1);
  }

  guardarNotaConDetalles() {
    if (!this.fecha || !this.lote || !this.proveedorId || this.detalles.length === 0) return;

    this.guardando = true;

    this.notaService.crearNotaEntrada({
      fecha: this.fecha,
      lote: this.lote,
      costoTotal: this.costoTotal,
      proveedorId: parseInt(this.proveedorId),
    }).subscribe({      
      next: (res: any) => {
        const nota = res.data.crearNotaEntrada;
        const notaId = nota.id;

        const promesas = this.detalles.map((detalle) => {
          return this.detalleService.crearDetalle({
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            costoUnitario: detalle.costoUnitario,
            notaEntradaId: notaId,
          }).toPromise();
        });

        Promise.all(promesas).then(() => {
          this.mensajeExito = 'Nota de entrada creada con éxito.';
          this.reiniciarFormulario();
        });
      },
      error: () => {
        this.guardando = false;
        alert('Ocurrió un error al guardar la nota.');
      }
    });
  }

  reiniciarFormulario() {
    this.fecha = '';
    this.lote = '';
    this.proveedorId = '';
    this.detalles = [];
    this.guardando = false;
  }

  getNombreProducto(id: number): string {
    const producto = this.productos.find(p => p.id === id);
    return producto ? producto.nombre : 'Desconocido';
  }
}
