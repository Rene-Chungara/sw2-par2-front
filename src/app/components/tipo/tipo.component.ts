import { Component, OnInit } from '@angular/core';
import { TipoService } from '../../services/tipo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 

@Component({
  selector: 'app-tipo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tipo.component.html',
})
export class TipoComponent implements OnInit {
  tipos: any[] = [];
  modalAbierto = false;
  modoEdicion = false;
  tipoEnEdicion: any = {};

  constructor(private tipoService: TipoService) {}

  ngOnInit(): void {
    this.tipoService.listarTipos().subscribe((res: any) => {
      this.tipos = res?.data?.listarTipos ?? [];
    });
  }

  abrirModal(tipo: any = null) {
    this.modalAbierto = true;
    this.modoEdicion = !!tipo;
    this.tipoEnEdicion = tipo
      ? JSON.parse(JSON.stringify(tipo))
      : { nombre: '', descripcion: '' };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarTipo() {
    if (this.modoEdicion) {
      this.tipoService.actualizarTipo(this.tipoEnEdicion).subscribe(() => {
        this.cerrarModal();
      });
    } else {
      this.tipoService
        .crearTipo(this.tipoEnEdicion.nombre, this.tipoEnEdicion.descripcion)
        .subscribe(() => {
          this.cerrarModal();
        });
    }
  }

  eliminarTipo(id: number) {
    this.tipoService.eliminarTipo(id).subscribe();
  }
}
