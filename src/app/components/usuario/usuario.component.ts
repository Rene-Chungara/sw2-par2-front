import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];
  roles: any[] = [];

  modalAbierto = false;
  modoEdicion = false;
  usuarioEnEdicion: any = {};

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.rolService.obtenerRoles().subscribe((res: any) => {
      this.roles = res.data.listarRoles;
    });
  }

  cargarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe((res: any) => {
      this.usuarios = res.data.listarUsuarios;
    });
  }

  abrirModal(usuario: any = null) {
    this.modalAbierto = true;
    this.modoEdicion = !!usuario;

    this.usuarioEnEdicion = usuario
      ? JSON.parse(JSON.stringify(usuario)) // copia profunda para editar sin afectar original
      : {
          ci: '',
          nombre: '',
          telefono: '',
          direccion: '',
          genero: 'M',
          correo: '',
          contrasena: '',
          rol: { id: 0 },
        };
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarUsuario() {
    const datos = {
      ...this.usuarioEnEdicion,
      rolId: this.usuarioEnEdicion.rol.id,
    };

    const accion = this.modoEdicion
      ? this.usuarioService.actualizarUsuario(datos)
      : this.usuarioService.crearUsuario(datos);

    accion.subscribe(() => {
      this.cerrarModal();
      this.cargarUsuarios();
    });
  }

  eliminarUsuario(id: number) {
    this.usuarioService.eliminarUsuario(id).subscribe(() => {
      this.cargarUsuarios();
    });
  }
}
