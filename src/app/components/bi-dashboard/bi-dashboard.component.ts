import { Component, OnInit } from '@angular/core';
import { BiDashboardService } from '../../services/bi-dashboard.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-bi-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  providers: [DatePipe],
  templateUrl: './bi-dashboard.component.html',
  styleUrl: './bi-dashboard.component.css'
})
export class BiDashboardComponent implements OnInit {
  kpis: any;

  ventasMesLabels: string[] = [];
  productosVendidosLabels: string[] = [];
  margenProductoLabels: string[] = [];

  ventasMesData: ChartData<'line'> = { labels: [], datasets: [] };
  productosVendidosData: ChartData<'bar'> = { labels: [], datasets: [] };
  margenProductoData: ChartData<'bar'> = { labels: [], datasets: [] };
  resumenKpis: any;

  constructor(private biService: BiDashboardService) {}

  ngOnInit(): void {
    // Obtener KPIs (y graficar ventas mensuales si están incluidas)
    this.biService.getResumenKpis().subscribe(data => {
      this.resumenKpis = data;
    });


    // Productos más vendidos
    this.biService.getProductosMasVendidos().subscribe({
      next: data => {
        if (data?.labels?.length && data?.values?.length) {
          this.productosVendidosData = {
            labels: data.labels,
            datasets: [{
              data: data.values,
              label: 'Cantidad Vendida',
              backgroundColor: '#42A5F5'
            }]
          };
        } else {
          console.warn('Estructura incorrecta en productos más vendidos', data);
        }
      },
      error: err => console.error('Error al cargar productos más vendidos:', err)
    });

    // Márgenes por producto
    this.biService.getMargenesPorProducto().subscribe({
      next: data => {
        if (data?.labels?.length && data?.values?.length) {
          this.margenProductoData = {
            labels: data.labels,
            datasets: [{
              data: data.values,
              label: 'Margen',
              backgroundColor: '#66BB6A'
            }]
          };
        } else {
          console.warn('Estructura incorrecta en margen por producto', data);
        }
      },
      error: err => console.error('Error al cargar margen por producto:', err)
    });

    this.biService.getVentasPorMes().subscribe({
      next: data => {
        if (data?.labels?.length && data?.values?.length) {
          this.ventasMesData = {
            labels: data.labels,
            datasets: [{
              data: data.values,
              label: 'Ventas',
              fill: false,
              tension: 0.3
            }]
          };
        } else {
          console.warn('Datos de ventas mensuales no válidos:', data);
        }
      },
      error: err => {
        console.error('Error al cargar ventas por mes:', err);
      }
    });

  }
}
