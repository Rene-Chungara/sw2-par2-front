import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  constructor(private apollo: Apollo) {}

  obtenerReporteVentasPorTipo() {
    const QUERY = gql`
      query {
        reporteVentasPorTipo {
          tipoNombre
          cantidadVentas
          totalGenerado
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: QUERY
    }).valueChanges.pipe(
      map(result => result.data.reporteVentasPorTipo)
    );
  }
}
