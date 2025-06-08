import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_DETALLES_QUERY = gql`
  query {
    listarDetallesNotaEntrada {
      id
      cantidad
      costoUnitario
      producto {
        id
        nombre
      }
      notaEntrada {
        id
        lote
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DetalleNotaEntradaService {
  constructor(private apollo: Apollo) {}

  listarDetalles() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_DETALLES_QUERY,
    }).valueChanges;
  }

  crearDetalle(detalle: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $productoId: ID!
          $cantidad: Int!
          $costoUnitario: Float!
          $notaEntradaId: ID!
        ) {
          crearDetalleNotaEntrada(
            productoId: $productoId
            cantidad: $cantidad
            costoUnitario: $costoUnitario
            notaEntradaId: $notaEntradaId
          ) {
            id
            cantidad
            costoUnitario
            producto {
              id
              nombre
            }
            notaEntrada {
              id
              lote
            }
          }
        }
      `,
      variables: {
        productoId: String(detalle.productoId),
        cantidad: detalle.cantidad,
        costoUnitario: detalle.costoUnitario,
        notaEntradaId: String(detalle.notaEntradaId),
      },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearDetalleNotaEntrada;
        if (!nuevo) return;
        const actual: any = cache.readQuery({ query: LISTAR_DETALLES_QUERY });
        if (actual?.listarDetallesNotaEntrada) {
          cache.writeQuery({
            query: LISTAR_DETALLES_QUERY,
            data: {
              listarDetallesNotaEntrada: [...actual.listarDetallesNotaEntrada, nuevo],
            },
          });
        }
      },
    });
  }

  actualizarDetalle(detalle: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $id: ID!
          $productoId: ID!
          $cantidad: Int!
          $costoUnitario: Float!
          $notaEntradaId: ID!
        ) {
          actualizarDetalleNotaEntrada(
            id: $id
            productoId: $productoId
            cantidad: $cantidad
            costoUnitario: $costoUnitario
            notaEntradaId: $notaEntradaId
          ) {
            id
            cantidad
            costoUnitario
            producto {
              id
              nombre
            }
            notaEntrada {
              id
              lote
            }
          }
        }
      `,
      variables: {
        id: String(detalle.id),
        productoId: String(detalle.productoId),
        cantidad: detalle.cantidad,
        costoUnitario: detalle.costoUnitario,
        notaEntradaId: String(detalle.notaEntradaId),
      },
      update: (cache, { data }) => {
        const actualizado = (data as any)?.actualizarDetalleNotaEntrada;
        if (!actualizado) return;
        const actual: any = cache.readQuery({ query: LISTAR_DETALLES_QUERY });
        if (actual?.listarDetallesNotaEntrada) {
          const nuevos = actual.listarDetallesNotaEntrada.map((d: any) =>
            d.id === actualizado.id ? actualizado : d
          );
          cache.writeQuery({
            query: LISTAR_DETALLES_QUERY,
            data: {
              listarDetallesNotaEntrada: nuevos,
            },
          });
        }
      },
    });
  }

  eliminarDetalle(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarDetalleNotaEntrada(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const actual: any = cache.readQuery({ query: LISTAR_DETALLES_QUERY });
        if (actual?.listarDetallesNotaEntrada) {
          cache.writeQuery({
            query: LISTAR_DETALLES_QUERY,
            data: {
              listarDetallesNotaEntrada: actual.listarDetallesNotaEntrada.filter((d: any) => d.id !== String(id)),
            },
          });
        }
      },
    });
  }

   obtenerDetallePorId(id: number) {
    return this.apollo.query<any>({
      query: gql`
        query ($id: ID!) {
          obtenerDetalleNotaEntrada(id: $id) {
            id
            cantidad
            costoUnitario
            producto {
              id
              nombre
            }
            notaEntrada {
              id
              lote
            }
          }
        }
      `,
      variables: { id },
      fetchPolicy: 'network-only'
    });
  }

  listarDetallesPorNota(notaEntradaId: number) {
    return this.apollo.query<any>({
      query: gql`
        query ($notaEntradaId: ID!) {
          listarDetallesPorNota(notaEntradaId: $notaEntradaId) {
            id
            cantidad
            costoUnitario
            producto {
              id
              nombre
            }
            notaEntrada {
              id
              lote
            }
          }
        }
      `,
      variables: { notaEntradaId },
      fetchPolicy: 'network-only'
    });
  }
}
