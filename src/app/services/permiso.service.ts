import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_PERMISOS_QUERY = gql`
  query {
    listarPermisos {
      id
      nombre
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  constructor(private apollo: Apollo) {}

  obtenerPermisos() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_PERMISOS_QUERY,
    }).valueChanges;
  }

  crearPermiso(nombre: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($nombre: String!) {
          crearPermiso(nombre: $nombre) {
            id
            nombre
          }
        }
      `,
      variables: { nombre },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearPermiso;
        if (!nuevo) return;

        const existing: any = cache.readQuery({ query: LISTAR_PERMISOS_QUERY });
        if (existing?.listarPermisos) {
          cache.writeQuery({
            query: LISTAR_PERMISOS_QUERY,
            data: {
              listarPermisos: [...existing.listarPermisos, nuevo],
            },
          });
        }
      },
    });
  }

  eliminarPermiso(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarPermiso(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existing: any = cache.readQuery({ query: LISTAR_PERMISOS_QUERY });
        if (existing?.listarPermisos) {
          cache.writeQuery({
            query: LISTAR_PERMISOS_QUERY,
            data: {
              listarPermisos: existing.listarPermisos.filter((p: any) => p.id !== String(id)),
            },
          });
        }
      },
    });
  }
}
