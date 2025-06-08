import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_USUARIOS_QUERY = gql`
  query {
    listarUsuarios {
      id
      ci
      nombre
      telefono
      direccion
      genero
      correo
      rol {
        id
        nombre
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private apollo: Apollo) {}

  listarUsuarios() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_USUARIOS_QUERY,
    }).valueChanges;
  }

  crearUsuario(usuario: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $ci: String!
          $nombre: String!
          $telefono: String!
          $direccion: String!
          $genero: String!
          $correo: String!
          $contrasena: String!
          $rolId: ID!
        ) {
          crearUsuario(
            ci: $ci
            nombre: $nombre
            telefono: $telefono
            direccion: $direccion
            genero: $genero
            correo: $correo
            contrasena: $contrasena
            rolId: $rolId
          ) {
            id
            ci
            nombre
            telefono
            direccion
            genero
            correo
            rol {
              id
              nombre
            }
          }
        }
      `,
      variables: {
        ...usuario,
        rolId: String(usuario.rolId),
      },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearUsuario;
        if (!nuevo) return;

        const existing: any = cache.readQuery({ query: LISTAR_USUARIOS_QUERY });
        if (existing?.listarUsuarios) {
          cache.writeQuery({
            query: LISTAR_USUARIOS_QUERY,
            data: {
              listarUsuarios: [...existing.listarUsuarios, nuevo],
            },
          });
        }
      },
    });
  }

  actualizarUsuario(usuario: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $id: ID!
          $ci: String!
          $nombre: String!
          $telefono: String!
          $direccion: String!
          $genero: String!
          $correo: String!
          $contrasena: String!
          $rolId: ID!
        ) {
          actualizarUsuario(
            id: $id
            ci: $ci
            nombre: $nombre
            telefono: $telefono
            direccion: $direccion
            genero: $genero
            correo: $correo
            contrasena: $contrasena
            rolId: $rolId
          ) {
            id
            ci
            nombre
            telefono
            direccion
            genero
            correo
            rol {
              id
              nombre
            }
          }
        }
      `,
      variables: {
        ...usuario,
        id: String(usuario.id),
        rolId: String(usuario.rolId),
      },
      update: (cache, { data }) => {
        const actualizado = (data as any)?.actualizarUsuario;
        if (!actualizado) return;

        const existing: any = cache.readQuery({ query: LISTAR_USUARIOS_QUERY });
        if (existing?.listarUsuarios) {
          const actualizados = existing.listarUsuarios.map((u: any) =>
            u.id === actualizado.id ? actualizado : u
          );
          cache.writeQuery({
            query: LISTAR_USUARIOS_QUERY,
            data: {
              listarUsuarios: actualizados,
            },
          });
        }
      },
    });
  }

  eliminarUsuario(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarUsuario(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existing: any = cache.readQuery({ query: LISTAR_USUARIOS_QUERY });
        if (existing?.listarUsuarios) {
          cache.writeQuery({
            query: LISTAR_USUARIOS_QUERY,
            data: {
              listarUsuarios: existing.listarUsuarios.filter(
                (u: any) => u.id !== String(id)
              ),
            },
          });
        }
      },
    });
  }

  obtenerUsuarios() {
    return this.apollo.query({
      query: LISTAR_USUARIOS_QUERY,
    });
  }
}
