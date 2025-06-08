import { Component, OnInit } from '@angular/core';
import { NotaEntradaService } from '../../services/nota-entrada.service';
import { ProveedorService } from '../../services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleNotaEntradaService } from '../../services/detalle-nota-entrada.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nota-entrada',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nota-entrada.component.html',
})
export class NotaEntradaComponent implements OnInit {
  notas: any[] = [];
  proveedores: any[] = [];
  modalAbierto = false;
  modoEdicion = false;
  notaEnEdicion: any = {};
  detallesDeNota: any[] = [];
  mostrarDetalles = false;
  notaSeleccionadaId: number | null = null;


  constructor(
    private notaService: NotaEntradaService,
    private proveedorService: ProveedorService,
    private detalleService: DetalleNotaEntradaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notaService.listarNotasEntrada().subscribe((res: any) => {
      this.notas = res.data.listarNotasEntrada;
    });

    this.proveedorService.obtenerProveedores().subscribe((res: any) => {
      this.proveedores = res.data.listarProveedores;
    });
  }

  abrirModal(nota: any = null) {
    this.modalAbierto = true;
    this.modoEdicion = !!nota;
    this.notaEnEdicion = nota
      ? { ...nota, proveedorId: nota.proveedor.id }
      : { fecha: '', lote: '', costoTotal: 0, proveedorId: '' };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarNota() {
    if (this.modoEdicion) {
      this.notaService.actualizarNotaEntrada(this.notaEnEdicion).subscribe(() => this.cerrarModal());
    } else {
      this.notaService.crearNotaEntrada(this.notaEnEdicion).subscribe(() => this.cerrarModal());
    }
  }

  eliminarNota(id: number) {
    this.notaService.eliminarNotaEntrada(id).subscribe();
  }

  verDetalles(id: number) {
    this.router.navigate(['/detalle-nota-entrada', id]);
  }

  creardetalle(): void {
    this.router.navigate(['/crear-notas-entradas']);
  }
}
