import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { UsuarioService } from '../../services/usuario.service';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-venta.component.html',
})
export class CrearVentaComponent implements OnInit {
  usuarios: any[] = [];
  productos: any[] = [];
  detalles: any[] = [];

  usuarioId: string = '';
  canalVenta: string = 'TIENDA';
  estado: string = 'PENDIENTE';
  fechaVenta: string = new Date().toISOString().slice(0, 10);

  constructor(
    private ventaService: VentaService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe((res: any) => {
      this.usuarios = res.data.listarUsuarios;
    });
    this.productoService.listarProductos().subscribe((res: any) => {
      this.productos = res.data.listarProductos;
    });
  }

  agregarDetalle(): void {
    this.detalles.push({ productoId: '', cantidad: 1, precioUnitario: 0 });
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
  }

  crearVenta(): void {
    const data = {
      usuarioId: parseInt(this.usuarioId),
      fechaVenta: this.fechaVenta,
      canalVenta: this.canalVenta,
      estado: this.estado,
      detalles: this.detalles.map((d) => ({
        productoId: parseInt(d.productoId),
        cantidad: parseInt(d.cantidad),
        precioUnitario: parseFloat(d.precioUnitario),
      })),
    };
    this.ventaService.crearVentaCompleta(data).subscribe(() => {
      this.router.navigate(['/ventas']);
    });
  }

  ventas(): void {
    this.router.navigate(['/ventas']);
  }
}
