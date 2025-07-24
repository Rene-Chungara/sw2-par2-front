import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ml-tester',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ml-tester.component.html'
})
export class MlTesterComponent {
  baseUrl = 'http://customer-segmentation-ml-production.up.railway.app';
  apiUrl = `${this.baseUrl}/api/v1`;

  ci: string = '';
  usuarioId: number | null = null;
  usuarioIds: number[] = [];

  cliente: any = null;
  compras: any[] = [];
  segmento: any = null;
  predicciones: any[] = [];
  clusters: any[] = [];
  jobId: string = '';

  constructor(private http: HttpClient) {}

  checkServiceHealth() {
    this.http.get<any>(`${this.baseUrl}/health`).subscribe(
      res => console.log('Health check:', res),
      () => alert('Error en health check')
    );
  }

  getCustomerData() {
    this.http.get<any[]>(`${this.apiUrl}/customers/data`).subscribe(
      res => {
        if (res.length) {
          this.cliente = res[0];
          this.usuarioId = res[0].usuario_id;
          this.usuarioIds = res.slice(0, 3).map(c => c.usuario_id);
        }
      },
      () => alert('Error al obtener clientes')
    );
  }

  getCustomerByCI() {
    if (!this.ci.trim()) return;
    this.http.get<any[]>(`${this.apiUrl}/customers/by-ci/${this.ci}`).subscribe(
      res => {
        if (res.length) {
          const cliente = res[0];
          this.cliente = cliente;
          this.usuarioId = cliente.usuario_id;
          this.usuarioIds = [cliente.usuario_id];
          this.compras = [];
        } else {
          this.cliente = null;
          this.usuarioId = null;
          this.usuarioIds = [];
        }
      },
      () => alert('Error al buscar cliente por CI')
    );
  }

  getCustomerPurchases() {
    if (!this.usuarioId) return;
    this.http.get<any[]>(`${this.apiUrl}/customers/${this.usuarioId}/purchases`).subscribe(
      res => this.compras = res,
      () => alert('Error al obtener compras')
    );
  }

  getSalesSummary() {
    this.http.get<any[]>(`${this.apiUrl}/sales/summary`).subscribe(
      res => console.table(res),
      () => alert('Error al obtener resumen de ventas')
    );
  }

  getProductCategories() {
    this.http.get<any[]>(`${this.apiUrl}/products/categories`).subscribe(
      res => console.table(res),
      () => alert('Error al obtener categorías')
    );
  }

  trainModel() {
    const body = { n_clusters: 4, usuario_ids: null };
    this.http.post<any>(`${this.apiUrl}/segment/train`, body).subscribe(
      res => {
        this.jobId = res.job_id;
        alert(`Entrenamiento iniciado. Job ID: ${this.jobId}`);
      },
      () => alert('Error al entrenar modelo')
    );
  }

  getJobStatus() {
    if (!this.jobId) return;
    this.http.get<any>(`${this.apiUrl}/segment/status/${this.jobId}`).subscribe(
      res => console.log('Estado del job:', res.status),
      () => alert('Error al consultar estado del job')
    );
  }

  getSegmentationResults() {
    if (!this.jobId) return;
    this.http.get<any>(`${this.apiUrl}/segment/results/${this.jobId}`).subscribe(
      res => {
        this.predicciones = res.segments || [];
        console.log('Segmentación:', res);
      },
      () => alert('Error al obtener resultados')
    );
  }

  getClusterSummaries() {
    this.http.get<any[]>(`${this.apiUrl}/segment/clusters/summary`).subscribe(
      res => {
        this.clusters = res.map(c => ({
          cluster_name: c.cluster_name?.startsWith('Cluster') ? c.cluster_name : `Cluster ${c.cluster_name}`,
          ...c
        }));
      },
      () => alert('Error al obtener resumen de clusters')
    );
  }

  predictIndividualSegments() {
    if (!this.usuarioIds.length) return;
    this.http.post<any[]>(`${this.apiUrl}/segment/predict`, this.usuarioIds).subscribe(
      res => this.predicciones = res,
      () => alert('Error al predecir segmentos')
    );
  }

  getCustomerSegment() {
    if (!this.usuarioId) return;
    this.http.get<any>(`${this.apiUrl}/customers/${this.usuarioId}/segment`).subscribe(
      res => this.segmento = res,
      () => alert('Error al obtener segmento del cliente')
    );
  }
}
