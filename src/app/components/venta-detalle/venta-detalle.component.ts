import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-venta-detalle',
  standalone: true,
  templateUrl: './venta-detalle.component.html',
  styleUrls: ['./venta-detalle.component.css'],
  imports: [CommonModule, FormsModule]
})
export class VentaDetalleComponent implements OnInit {
  venta: any;
  detalles: any[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.ventaService.obtenerVentaConDetalles(id).subscribe({
        next: (res: any) => {
          this.venta = res.data.obtenerVentaConDetalles;
          this.detalles = this.venta?.detalleVentas || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar detalles de la venta';
          this.loading = false;
        }
      });
    }
  }

  ventas(): void {
    this.router.navigate(['/ventas']);
  }
}
