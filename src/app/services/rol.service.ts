import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_ROLES_QUERY = gql`
  query {
    listarRoles {
      id
      nombre
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RolService {
  constructor(private apollo: Apollo) {}

  obtenerRoles() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_ROLES_QUERY,
    }).valueChanges;
  }

  crearRol(nombre: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($nombre: String!) {
          crearRol(nombre: $nombre) {
            id
            nombre
          }
        }
      `,
      variables: { nombre },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearRol;
        if (!nuevo) return;

        const existing: any = cache.readQuery({ query: LISTAR_ROLES_QUERY });
        if (existing?.listarRoles) {
          cache.writeQuery({
            query: LISTAR_ROLES_QUERY,
            data: {
              listarRoles: [...existing.listarRoles, nuevo],
            },
          });
        }
      },
    });
  }

  eliminarRol(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarRol(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existing: any = cache.readQuery({ query: LISTAR_ROLES_QUERY });
        if (existing?.listarRoles) {
          cache.writeQuery({
            query: LISTAR_ROLES_QUERY,
            data: {
              listarRoles: existing.listarRoles.filter((r: any) => r.id !== String(id)),
            },
          });
        }
      },
    });
  }
}
