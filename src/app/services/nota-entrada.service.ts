import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_NOTAS_ENTRADA_QUERY = gql`
  query {
    listarNotasEntrada {
      id
      fecha
      lote
      costoTotal
      proveedor {
        id
        nombre
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class NotaEntradaService {
  constructor(private apollo: Apollo) {}

  listarNotasEntrada() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_NOTAS_ENTRADA_QUERY,
    }).valueChanges;
  }

  crearNotaEntrada(nota: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $fecha: String!
          $lote: String!
          $costoTotal: Float!
          $proveedorId: ID!
        ) {
          crearNotaEntrada(
            fecha: $fecha
            lote: $lote
            costoTotal: $costoTotal
            proveedorId: $proveedorId
          ) {
            id
            fecha
            lote
            costoTotal
            proveedor {
              id
              nombre
            }
          }
        }
      `,
      variables: {
        ...nota,
        proveedorId: String(nota.proveedorId),
      },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearNotaEntrada;
        if (!nuevo) return;
        const existente: any = cache.readQuery({ query: LISTAR_NOTAS_ENTRADA_QUERY });
        if (existente?.listarNotasEntrada) {
          cache.writeQuery({
            query: LISTAR_NOTAS_ENTRADA_QUERY,
            data: {
              listarNotasEntrada: [...existente.listarNotasEntrada, nuevo],
            },
          });
        }
      },
    });
  }

  actualizarNotaEntrada(nota: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $id: ID!
          $fecha: String!
          $lote: String!
          $costoTotal: Float!
          $proveedorId: ID!
        ) {
          actualizarNotaEntrada(
            id: $id
            fecha: $fecha
            lote: $lote
            costoTotal: $costoTotal
            proveedorId: $proveedorId
          ) {
            id
            fecha
            lote
            costoTotal
            proveedor {
              id
              nombre
            }
          }
        }
      `,
      variables: {
        ...nota,
        id: String(nota.id),
        proveedorId: String(nota.proveedorId),
      },
      update: (cache, { data }) => {
        const actualizado = (data as any)?.actualizarNotaEntrada;
        if (!actualizado) return;
        const existente: any = cache.readQuery({ query: LISTAR_NOTAS_ENTRADA_QUERY });
        if (existente?.listarNotasEntrada) {
          const nuevas = existente.listarNotasEntrada.map((n: any) =>
            n.id === actualizado.id ? actualizado : n
          );
          cache.writeQuery({
            query: LISTAR_NOTAS_ENTRADA_QUERY,
            data: { listarNotasEntrada: nuevas },
          });
        }
      },
    });
  }

  eliminarNotaEntrada(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarNotaEntrada(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existente: any = cache.readQuery({ query: LISTAR_NOTAS_ENTRADA_QUERY });
        if (existente?.listarNotasEntrada) {
          cache.writeQuery({
            query: LISTAR_NOTAS_ENTRADA_QUERY,
            data: {
              listarNotasEntrada: existente.listarNotasEntrada.filter((n: any) => n.id !== String(id)),
            },
          });
        }
      },
    });
  }
}
