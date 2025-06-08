// rolpermiso.service.ts
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';


  const LISTAR_ROL_PERMISOS_QUERY = gql`
    query {
      listarRolPermisos {
        id
        rol { id nombre }
        permiso { id nombre }
      }
    }
  `;

@Injectable({
  providedIn: 'root',
})
export class RolPermisoService {
  constructor(private apollo: Apollo) {}

  listarRolPermiso() {
    return this.apollo.watchQuery<any>({
      query: gql`
        query {
          listarRolPermisos {
            id
            rol {
              id
              nombre
            }
            permiso {
              id
              nombre
            }
          }
        }
      `,
    }).valueChanges;
  }

  crearRolPermiso(rolId: number, permisoId: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($rolId: ID!, $permisoId: ID!) {
          crearRolPermiso(rolId: $rolId, permisoId: $permisoId) {
            id
            rol { id nombre }
            permiso { id nombre }
          }
        }
      `,
      variables: {
        rolId: String(rolId),
        permisoId: String(permisoId),
      },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearRolPermiso;
        if (!nuevo) return;

        const existing: any = cache.readQuery({ query: LISTAR_ROL_PERMISOS_QUERY });

        if (existing?.listarRolPermisos) {
          cache.writeQuery({
            query: LISTAR_ROL_PERMISOS_QUERY,
            data: {
              listarRolPermisos: [...existing.listarRolPermisos, nuevo],
            },
          });
        }
      },
    });
  }

  eliminarRolPermiso(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarRolPermiso(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const data: any = cache.readQuery({ query: LISTAR_ROL_PERMISOS_QUERY });

        if (data?.listarRolPermisos) {
          cache.writeQuery({
            query: LISTAR_ROL_PERMISOS_QUERY,
            data: {
              listarRolPermisos: data.listarRolPermisos.filter((item: any) => item.id !== id),
            },
          });
        }
      }
    });
  }

}
