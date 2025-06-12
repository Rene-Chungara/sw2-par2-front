import { Component, OnInit } from '@angular/core';
import { NotaEntradaService } from '../../services/nota-entrada.service';
import { ProveedorService } from '../../services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleNotaEntradaService } from '../../services/detalle-nota-entrada.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


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
  qrs: { [lote: string]: SafeUrl } = {};


  constructor(
    private notaService: NotaEntradaService,
    private proveedorService: ProveedorService,
    private detalleService: DetalleNotaEntradaService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    this.notaService.listarNotasEntrada().subscribe((res: any) => {
      this.notas = res.data.listarNotasEntrada;
      this.notas.forEach((nota: any) => {
        this.obtenerQRDesdeVista(nota.lote).then(qr => {
          if (qr) this.qrs[nota.lote] = qr;
        });
      });
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

  verDetalles(notaId: number) {
    this.router.navigate(['/detalle-nota-entrada', notaId]);
  }

  creardetalle(): void {
    this.router.navigate(['/crear-notas-entradas']);
  }

  async obtenerQRDesdeVista(lote: string): Promise<SafeUrl | null> {
    const url = `http://a35ff98ba79d145fdbde8ee6aafee109-1581426069.sa-east-1.elb.amazonaws.com:4000/notas/lote/${encodeURIComponent(lote)}/vista`;
    //const url = `http://localhost:3000/notas/lote/${encodeURIComponent(lote)}/vista`;

    try {
      const response = await this.http.get(url, { responseType: 'text' }).toPromise();
      if (!response) return null;

      const regex = /<img src="(data:image\/png;base64,[^"]+)"/;
      const match = response.match(regex);

      if (match && match[1]) {
        return this.sanitizer.bypassSecurityTrustUrl(match[1]);
      }
    } catch (e) {
      console.error(`No se pudo obtener QR del lote ${lote}:`, e);
    }
    return null;
  }

  // 👇 Agrega estas propiedades nuevas
  qrModalAbierto = false;
  qrLoteActual: string = '';
  qrImagenActual: SafeUrl | null = null;

  // 👇 Nueva función para abrir el modal
  abrirQRModal(lote: string) {
    this.qrLoteActual = lote;
    this.qrModalAbierto = true;

    this.obtenerQRDesdeVista(lote).then(qr => {
      this.qrImagenActual = qr;
    });
  }

  // 👇 Función para cerrar el modal
  cerrarQRModal() {
    this.qrModalAbierto = false;
    this.qrImagenActual = null;
    this.qrLoteActual = '';
  }

}
