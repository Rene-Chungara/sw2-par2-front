// detalle-nota-entrada.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleNotaEntradaService } from '../../services/detalle-nota-entrada.service';
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
  loading = false;
  error = '';
  notaEntradaId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detalleService: DetalleNotaEntradaService
  ) {}

  ngOnInit(): void {
    this.notaEntradaId = this.route.snapshot.paramMap.get('id');
    if (this.notaEntradaId) {
      this.loading = true;
      this.detalleService.listarDetallesPorNota(parseInt(this.notaEntradaId)).subscribe({
        next: (res: any) => {
          this.detalles = res.data.listarDetallesPorNota;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar los detalles de la nota de entrada';
          this.loading = false;
        },
      });
    }
  }

  volver() {
    this.router.navigate(['/notas-entradas']);
  }
}
