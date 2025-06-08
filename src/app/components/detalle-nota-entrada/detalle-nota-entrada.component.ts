import { Component, OnInit } from '@angular/core';
import { DetalleNotaEntradaService } from '../../services/detalle-nota-entrada.service';
import { ProductoService } from '../../services/producto.service';
import { NotaEntradaService } from '../../services/nota-entrada.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-nota-entrada',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './detalle-nota-entrada.component.html',
})
export class DetalleNotaEntradaComponent implements OnInit {
  detalles: any[] = [];
  productos: any[] = [];
  notas: any[] = [];

  modalAbierto = false;
  modoEdicion = false;
  detalleEnEdicion: any = {};

  constructor(
    private detalleService: DetalleNotaEntradaService,
    private productoService: ProductoService,
    private notaService: NotaEntradaService
  ) {}

  ngOnInit(): void {
    this.detalleService.listarDetalles().subscribe((res: any) => {
      this.detalles = res.data.listarDetallesNotaEntrada;
    });

    this.productoService.listarProductos().subscribe((res: any) => {
      this.productos = res.data.listarProductos;
    });

    this.notaService.listarNotasEntrada().subscribe((res: any) => {
      this.notas = res.data.listarNotasEntrada;
    });
  }

  abrirModal(detalle: any = null) {
    this.modalAbierto = true;
    this.modoEdicion = !!detalle;
    this.detalleEnEdicion = detalle
      ? {
          ...detalle,
          productoId: detalle.producto.id,
          notaEntradaId: detalle.notaEntrada.id,
        }
      : {
          productoId: '',
          notaEntradaId: '',
          cantidad: 1,
          costoUnitario: 0,
        };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarDetalle() {
    if (this.modoEdicion) {
      this.detalleService.actualizarDetalle(this.detalleEnEdicion).subscribe(() => this.cerrarModal());
    } else {
      this.detalleService.crearDetalle(this.detalleEnEdicion).subscribe(() => this.cerrarModal());
    }
  }

  eliminarDetalle(id: number) {
    this.detalleService.eliminarDetalle(id).subscribe();
  }
}
