import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, catchError, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apollo: Apollo) { }
  getEficienciaProduccion(anio: number, mes: number): Observable<number> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($anio: Int!, $mes: Int!) {
          eficienciaProduccion(anio: $anio, mes: $mes) {
            eficiencia
          }
        }
      `,
      variables: { anio, mes }
    }).valueChanges.pipe(
      map(result => {
        const datos = result.data?.eficienciaProduccion;
        if (!Array.isArray(datos) || datos.length === 0) {
          console.warn('⚠️ eficienciaProduccion vacío o inválido');
          return 0;
        }
        const promedio = datos.reduce((acc: number, curr: any) => acc + curr.eficiencia, 0) / datos.length;
        return Math.round(promedio * 100) / 100;
      }),
      catchError(err => {
        console.error('❌ Error en getEficienciaProduccion:', err);
        return of(0); // Devolver 0 en caso de error
      })
    );
  }

  getMargenBruto(anio: number, mes: number): Observable<number> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query($anio: Int!, $mes: Int!) {
          margenBruto(anio: $anio, mes: $mes) {
            margen
          }
        }
      `,
      variables: { anio, mes }
    }).valueChanges.pipe(
      map(result => {
        const datos = result.data?.margenBruto;
        if (!Array.isArray(datos) || datos.length === 0) {
          console.warn('⚠️ margenBruto vacío o inválido');
          return 0;
        }
        const promedio = datos.reduce((acc: number, curr: any) => acc + curr.margen, 0) / datos.length;
        return Math.round(promedio * 100) / 100;
      }),
      catchError(err => {
        console.error('❌ Error en getMargenBruto:', err);
        return of(0); // Devolver 0 en caso de error
      })
    );
  }

  getVentasPorCategoria(anio: number, mes: number): Observable<{ categoria: string, total: number }[]> {
    return this.apollo.query<any>({
      query: gql`
        query($anio: Int!, $mes: Int!) {
          ventasPorCategoria(anio: $anio, mes: $mes) {
            categoria
            totalVentas
          }
        }
      `,
      variables: { anio, mes },
      fetchPolicy: 'network-only' // Forzar a que siempre actualice el gráfico
    }).pipe(
      map(result => {
        const datos = result.data?.ventasPorCategoria;
        if (!Array.isArray(datos) || datos.length === 0) {
          console.warn('⚠️ ventasPorCategoria vacío o inválido');
          return [];
        }
        return datos.map((item: any) => ({
          categoria: item.categoria,
          total: Math.round(item.totalVentas * 100) / 100
        }));
      }),
      catchError(err => {
        console.error('❌ Error en getVentasPorCategoria:', err);
        return of([]); // Devolver array vacío en caso de error
      })
    );
  }

  getAniosMesesDisponiblesVentas(): Observable<{ anio: number, mes: number }[]> {
    return this.apollo.watchQuery<any>({
      query: gql`
        query {
          aniosMesesDisponiblesVentas {
            anio
            mes
          }
        }
      `
    }).valueChanges.pipe(
      map(result => result.data?.aniosMesesDisponiblesVentas ?? []),
      catchError(err => {
        console.error('❌ Error en getAniosMesesDisponiblesVentas:', err);
        return of([]);
      })
    );
  }
}
