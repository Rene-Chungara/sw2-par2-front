import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BiDashboardService {
  private baseUrl = 'https://sw2-par2-bi-production.up.railway.app'; // Prefijo correcto del backend

  constructor(private http: HttpClient) {}

  // KPI: Ventas mensuales
  getKpis(): Observable<any> {
    return this.http.get(`${this.baseUrl}/kpis/ventas-mensuales`);
  }

  getResumenKpis(): Observable<any> {
    return this.http.get(`${this.baseUrl}/kpis/resumen`);
  }

  getVentasPorMes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/kpis/ventas-mensuales`);
  }

  // Chart: Productos más vendidos
  getProductosMasVendidos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/charts/productos-mas-vendidos`);
  }

  // Chart: Margen de ganancia por producto
  getMargenesPorProducto(): Observable<any> {
    return this.http.get(`${this.baseUrl}/charts/margen-ganancia`);
  }
}
