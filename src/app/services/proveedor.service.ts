import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_PROVEEDORES_QUERY = gql`
  query {
    listarProveedores {
      id
      nombre
      origen
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  constructor(private apollo: Apollo) {}

  listarProveedores() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_PROVEEDORES_QUERY,
    }).valueChanges;
  }

  obtenerProveedores() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_PROVEEDORES_QUERY,
    }).valueChanges;
  }
  
  crearProveedor(nombre: string, origen: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($nombre: String!, $origen: String!) {
          crearProveedor(nombre: $nombre, origen: $origen) {
            id
            nombre
            origen
          }
        }
      `,
      variables: { nombre, origen },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearProveedor;
        if (!nuevo) return;
        const existing: any = cache.readQuery({ query: LISTAR_PROVEEDORES_QUERY });
        if (existing?.listarProveedores) {
          cache.writeQuery({
            query: LISTAR_PROVEEDORES_QUERY,
            data: {
              listarProveedores: [...existing.listarProveedores, nuevo],
            },
          });
        }
      },
    });
  }

  actualizarProveedor(proveedor: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!, $nombre: String!, $origen: String!) {
          actualizarProveedor(id: $id, nombre: $nombre, origen: $origen) {
            id
            nombre
            origen
          }
        }
      `,
      variables: {
        id: String(proveedor.id),
        nombre: proveedor.nombre,
        origen: proveedor.origen,
      },
      update: (cache, { data }) => {
        const actualizado = (data as any)?.actualizarProveedor;
        if (!actualizado) return;
        const existing: any = cache.readQuery({ query: LISTAR_PROVEEDORES_QUERY });
        if (existing?.listarProveedores) {
          const actualizados = existing.listarProveedores.map((p: any) =>
            p.id === actualizado.id ? actualizado : p
          );
          cache.writeQuery({
            query: LISTAR_PROVEEDORES_QUERY,
            data: {
              listarProveedores: actualizados,
            },
          });
        }
      },
    });
  }

  eliminarProveedor(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarProveedor(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existing: any = cache.readQuery({ query: LISTAR_PROVEEDORES_QUERY });
        if (existing?.listarProveedores) {
          cache.writeQuery({
            query: LISTAR_PROVEEDORES_QUERY,
            data: {
              listarProveedores: existing.listarProveedores.filter((p: any) => p.id !== String(id)),
            },
          });
        }
      },
    });
  }
}
