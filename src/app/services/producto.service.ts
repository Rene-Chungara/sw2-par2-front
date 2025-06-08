import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HttpClient } from '@angular/common/http';

const BASE_URL = 'http://localhost:8080';

const LISTAR_PRODUCTOS_QUERY = gql`
  query {
    listarProductos {
      id
      nombre
      precioVenta
      imagen
      stock
      descripcion
      tipo {
        id
        nombre
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class ProductoService {
  constructor(private apollo: Apollo, private http: HttpClient) {}

  listarProductos() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_PRODUCTOS_QUERY,
    }).valueChanges;
  }

  crearProducto(producto: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $nombre: String!
          $precioVenta: Float!
          $imagen: String!
          $stock: Int!
          $descripcion: String!
          $tipoId: ID!
        ) {
          crearProducto(
            nombre: $nombre
            precioVenta: $precioVenta
            imagen: $imagen
            stock: $stock
            descripcion: $descripcion
            tipoId: $tipoId
          ) {
            id
            nombre
            imagen
            stock
            precioVenta
            descripcion
            tipo { id nombre }
          }
        }
      `,
      variables: {
        ...producto,
        tipoId: String(producto.tipoId),
      },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearProducto;
        if (!nuevo) return;
        const existente: any = cache.readQuery({ query: LISTAR_PRODUCTOS_QUERY });
        if (existente?.listarProductos) {
          cache.writeQuery({
            query: LISTAR_PRODUCTOS_QUERY,
            data: {
              listarProductos: [...existente.listarProductos, nuevo],
            },
          });
        }
      }
    });
  }

  actualizarProducto(producto: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation (
          $id: ID!
          $nombre: String!
          $precioVenta: Float!
          $imagen: String!
          $stock: Int!
          $descripcion: String!
          $tipoId: ID!
        ) {
          actualizarProducto(
            id: $id
            nombre: $nombre
            precioVenta: $precioVenta
            imagen: $imagen
            stock: $stock
            descripcion: $descripcion
            tipoId: $tipoId
          ) {
            id
            nombre
            imagen
            stock
            precioVenta
            descripcion
            tipo { id nombre }
          }
        }
      `,
      variables: {
        ...producto,
        tipoId: String(producto.tipoId),
        id: String(producto.id),
      },
      update: (cache, { data }) => {
        const actualizado = (data as any)?.actualizarProducto;
        if (!actualizado) return;
        const existente: any = cache.readQuery({ query: LISTAR_PRODUCTOS_QUERY });
        if (existente?.listarProductos) {
          const actualizadoLista = existente.listarProductos.map((p: any) =>
            p.id === actualizado.id ? actualizado : p
          );
          cache.writeQuery({
            query: LISTAR_PRODUCTOS_QUERY,
            data: {
              listarProductos: actualizadoLista,
            },
          });
        }
      }
    });
  }

  eliminarProducto(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarProducto(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existente: any = cache.readQuery({ query: LISTAR_PRODUCTOS_QUERY });
        if (existente?.listarProductos) {
          const nuevaLista = existente.listarProductos.filter((p: any) => p.id !== String(id));
          cache.writeQuery({
            query: LISTAR_PRODUCTOS_QUERY,
            data: {
              listarProductos: nuevaLista,
            },
          });
        }
      }
    });
  }

  subirImagen(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ path: string }>(`${BASE_URL}/uploads`, formData);
  }
}
