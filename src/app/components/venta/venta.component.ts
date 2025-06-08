import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './venta.component.html',
})
export class VentaComponent implements OnInit {
  ventas: any[] = [];
  loading = true;
  error: any;

  constructor(private ventaService: VentaService, private router: Router) {}

  ngOnInit(): void {
    this.ventaService.listarVentas().subscribe({
      next: (res: any) => {
        this.ventas = res.data.listarVentas;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }

  irACrearVenta(): void {
    this.router.navigate(['/crear-venta']);
  }

  verDetalle(id: number) {
    this.router.navigate(['/detalle-venta', id]);
  }

  eliminarVenta(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta venta?')) return;
    this.ventaService.eliminarVenta(id).subscribe();
  }
}
