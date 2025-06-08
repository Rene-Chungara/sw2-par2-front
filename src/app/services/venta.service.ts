import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_VENTAS_QUERY = gql`
  query {
    listarVentas {
      id
      fechaVenta
      canalVenta
      estado
      ventaTotal
      usuario {
        id
        nombre
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class VentaService {
  constructor(private apollo: Apollo) {}

  listarVentas() {
    return this.apollo.watchQuery({ query: LISTAR_VENTAS_QUERY }).valueChanges;
  }

  obtenerVenta(id: number) {
    return this.apollo.query({
      query: gql`
        query ($id: Int!) {
          obtenerVenta(id: $id) {
            id
            fechaVenta
            canalVenta
            estado
            ventaTotal
            usuario { id nombre }
          }
        }
      `,
      variables: { id },
    });
  }

  ventasPorEstado(estado: string) {
    return this.apollo.query({
      query: gql`
        query ($estado: String!) {
          ventasPorEstado(estado: $estado) {
            id fechaVenta canalVenta estado ventaTotal
          }
        }
      `,
      variables: { estado },
    });
  }

  ventasPorFecha(fecha: string) {
    return this.apollo.query({
      query: gql`
        query ($fecha: String!) {
          ventasPorFecha(fecha: $fecha) {
            id fechaVenta canalVenta estado ventaTotal
          }
        }
      `,
      variables: { fecha },
    });
  }

  ventasDelDia() {
    return this.apollo.query({
      query: gql`
        query {
          ventasDelDia {
            id fechaVenta canalVenta estado ventaTotal
          }
        }
      `,
    });
  }

  ventasEntreFechas(fechaInicio: string, fechaFin: string) {
    return this.apollo.query({
      query: gql`
        query ($fechaInicio: String!, $fechaFin: String!) {
          ventasEntreFechas(fechaInicio: $fechaInicio, fechaFin: $fechaFin) {
            id fechaVenta canalVenta estado ventaTotal
          }
        }
      `,
      variables: { fechaInicio, fechaFin },
    });
  }

  crearVenta(data: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $usuarioId: Int!, $fechaVenta: String!, $estado: String!, $canalVenta: String!
        ) {
          crearVenta(usuarioId: $usuarioId, fechaVenta: $fechaVenta, estado: $estado, canalVenta: $canalVenta) {
            id fechaVenta canalVenta estado ventaTotal
          }
        }
      `,
      variables: data,
    });
  }

  crearVentaCompleta(data: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $usuarioId: Int!, $fechaVenta: String!, $estado: String!, $canalVenta: String!,
          $detalles: [DetalleVentaInput!]!
        ) {
          crearVentaCompleta(
            usuarioId: $usuarioId, fechaVenta: $fechaVenta,
            estado: $estado, canalVenta: $canalVenta, detalles: $detalles
          ) {
            id fechaVenta canalVenta estado ventaTotal
            usuario { id nombre }
          }
        }
      `,
      variables: data,
      update: (cache, { data }) => {
        const nueva = (data as any)?.crearVentaCompleta;
        if (!nueva) return;
        const existente: any = cache.readQuery({ query: LISTAR_VENTAS_QUERY });
        if (existente?.listarVentas) {
          cache.writeQuery({
            query: LISTAR_VENTAS_QUERY,
            data: {
              listarVentas: [...existente.listarVentas, nueva],
            },
          });
        }
      },
    });
  }

  actualizarVenta(data: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $id: Int!, $usuarioId: Int, $fechaVenta: String,
          $ventaTotal: Float, $estado: String, $canalVenta: String
        ) {
          actualizarVenta(
            id: $id, usuarioId: $usuarioId,
            fechaVenta: $fechaVenta, ventaTotal: $ventaTotal,
            estado: $estado, canalVenta: $canalVenta
          ) {
            id fechaVenta canalVenta estado ventaTotal
          }
        }
      `,
      variables: data,
    });
  }

  cambiarEstadoVenta(id: number, nuevoEstado: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: Int!, $nuevoEstado: String!) {
          cambiarEstadoVenta(id: $id, nuevoEstado: $nuevoEstado) {
            id estado
          }
        }
      `,
      variables: { id, nuevoEstado },
    });
  }

  eliminarVenta(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarVenta(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existente: any = cache.readQuery({ query: LISTAR_VENTAS_QUERY });
        if (existente?.listarVentas) {
          cache.writeQuery({
            query: LISTAR_VENTAS_QUERY,
            data: {
              listarVentas: existente.listarVentas.filter((v: any) => v.id !== String(id)),
            },
          });
        }
      },
    });
  }

  // --- DETALLES DE VENTA ---

  listarDetallesVenta() {
    return this.apollo.query({
      query: gql`
        query {
          listarDetallesVenta {
            id cantidad precioUnitario
            producto { id nombre }
            venta { id }
          }
        }
      `,
    });
  }

  obtenerDetalleVenta(id: number) {
    return this.apollo.query({
      query: gql`
        query ($id: Int!) {
          obtenerDetalleVenta(id: $id) {
            id cantidad precioUnitario
            producto { id nombre }
          }
        }
      `,
      variables: { id },
    });
  }

  obtenerVentaConDetalles(id: number) {
    return this.apollo.query<any>({
      query: gql`
        query ($id: Int!) {
          obtenerVentaConDetalles(id: $id) {
            id
            fechaVenta
            canalVenta
            estado
            ventaTotal
            usuario {
              id
              nombre
            }
            detalleVentas {
              id
              cantidad
              precioUnitario
              producto {
                id
                nombre
              }
            }
          }
        }
      `,
      variables: { id }
    });
  }

  listarDetallesPorVenta(ventaId: number) {
    return this.apollo.query({
      query: gql`
        query ($ventaId: Int!) {
          listarDetallesPorVenta(ventaId: $ventaId) {
            id cantidad precioUnitario
            producto { id nombre }
          }
        }
      `,
      variables: { ventaId },
    });
  }

  crearDetalleVenta(data: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $productoId: Int!, $cantidad: Int!, $precioUnitario: Float!, $ventaId: Int!
        ) {
          crearDetalleVenta(
            productoId: $productoId,
            cantidad: $cantidad,
            precioUnitario: $precioUnitario,
            ventaId: $ventaId
          ) {
            id cantidad precioUnitario producto { id nombre }
          }
        }
      `,
      variables: data,
    });
  }

  actualizarDetalleVenta(data: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $id: Int!, $productoId: Int, $cantidad: Int, $precioUnitario: Float, $ventaId: Int
        ) {
          actualizarDetalleVenta(
            id: $id,
            productoId: $productoId,
            cantidad: $cantidad,
            precioUnitario: $precioUnitario,
            ventaId: $ventaId
          ) {
            id cantidad precioUnitario
          }
        }
      `,
      variables: data,
    });
  }

  eliminarDetalleVenta(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: Int!) {
          eliminarDetalleVenta(id: $id)
        }
      `,
      variables: { id },
    });
  }
}
