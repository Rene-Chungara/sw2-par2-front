import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TipoService, Tipo } from '../../services/tipo.service';

@Component({
  selector: 'app-tipo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo.component.html'
})
export class TipoComponent implements OnInit {
  tipos: Tipo[] = [];
  nuevoNombre = '';
  nuevaDescripcion = '';

  constructor(private tipoService: TipoService) {}

  ngOnInit(): void {
    this.obtenerTipos();
  }

  obtenerTipos(): void {
    this.tipoService.getTipos().subscribe({
      next: (data) => {
        this.tipos = data.sort((a, b) => a.id - b.id);
      },
      error: (err) => console.error('Error al obtener tipos', err)
    });
  }

  crearTipo(): void {
    const nombre = this.nuevoNombre.trim();
    const descripcion = this.nuevaDescripcion.trim();
    if (nombre && descripcion) {
      this.tipoService.createTipo({ nombre, descripcion }).subscribe({
        next: () => {
          this.nuevoNombre = '';
          this.nuevaDescripcion = '';
          this.obtenerTipos();
        },
        error: (err) => console.error('Error al crear tipo', err)
      });
    }
  }

  eliminarTipo(id: number): void {
    this.tipoService.deleteTipo(id).subscribe({
      next: () => this.obtenerTipos(),
      error: (err) => console.error('Error al eliminar tipo', err)
    });
  }

  // al final de la clase TipoComponent
  modalAbierto = false;
  modoEdicion = false;
  tipoEnEdicion: Tipo | null = null;

  abrirModal(tipo?: Tipo): void {
    this.modalAbierto = true;
    if (tipo) {
      this.modoEdicion = true;
      this.tipoEnEdicion = { ...tipo };
    } else {
      this.modoEdicion = false;
      this.tipoEnEdicion = { id: 0, nombre: '', descripcion: '' };
    }
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.tipoEnEdicion = null;
  }

  guardarTipo(): void {
    if (!this.tipoEnEdicion) return;

    const data = {
      nombre: this.tipoEnEdicion.nombre.trim(),
      descripcion: this.tipoEnEdicion.descripcion.trim()
    };

    if (this.modoEdicion && this.tipoEnEdicion.id) {
      this.tipoService.updateTipo(this.tipoEnEdicion.id, data).subscribe(() => {
        this.obtenerTipos();
        this.cerrarModal();
      });
    } else {
      this.tipoService.createTipo(data).subscribe(() => {
        this.obtenerTipos();
        this.cerrarModal();
      });
    }
  }

}
