import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const LISTAR_TIPOS_QUERY = gql`
  query {
    listarTipos {
      id
      nombre
      descripcion
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class TipoService {
  constructor(private apollo: Apollo) {}

  listarTipos() {
    return this.apollo.watchQuery<any>({
      query: LISTAR_TIPOS_QUERY,
    }).valueChanges;
  }

  crearTipo(nombre: string, descripcion: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($nombre: String!, $descripcion: String!) {
          crearTipo(nombre: $nombre, descripcion: $descripcion) {
            id
            nombre
            descripcion
          }
        }
      `,
      variables: { nombre, descripcion },
      update: (cache, { data }) => {
        const nuevo = (data as any)?.crearTipo;
        if (!nuevo) return;
        const existing: any = cache.readQuery({ query: LISTAR_TIPOS_QUERY });
        if (existing?.listarTipos) {
          cache.writeQuery({
            query: LISTAR_TIPOS_QUERY,
            data: {
              listarTipos: [...existing.listarTipos, nuevo],
            },
          });
        }
      },
    });
  }

  actualizarTipo(tipo: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!, $nombre: String!, $descripcion: String!) {
          actualizarTipo(id: $id, nombre: $nombre, descripcion: $descripcion) {
            id
            nombre
            descripcion
          }
        }
      `,
      variables: {
        id: String(tipo.id),
        nombre: tipo.nombre,
        descripcion: tipo.descripcion,
      },
      update: (cache, { data }) => {
        const actualizado = (data as any)?.actualizarTipo;
        if (!actualizado) return;
        const existing: any = cache.readQuery({ query: LISTAR_TIPOS_QUERY });
        if (existing?.listarTipos) {
          const nuevos = existing.listarTipos.map((t: any) =>
            t.id === actualizado.id ? actualizado : t
          );
          cache.writeQuery({
            query: LISTAR_TIPOS_QUERY,
            data: {
              listarTipos: nuevos,
            },
          });
        }
      },
    });
  }

  eliminarTipo(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          eliminarTipo(id: $id)
        }
      `,
      variables: { id: String(id) },
      update: (cache) => {
        const existing: any = cache.readQuery({ query: LISTAR_TIPOS_QUERY });
        if (existing?.listarTipos) {
          cache.writeQuery({
            query: LISTAR_TIPOS_QUERY,
            data: {
              listarTipos: existing.listarTipos.filter((t: any) => t.id !== String(id)),
            },
          });
        }
      },
    });
  }
}
