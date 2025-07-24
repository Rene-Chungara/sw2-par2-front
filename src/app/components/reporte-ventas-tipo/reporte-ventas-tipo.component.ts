import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { ReporteService } from '../../services/reporte.service';

@Component({
  selector: 'app-reporte-ventas-tipo',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './reporte-ventas-tipo.component.html',
  styleUrls: ['./reporte-ventas-tipo.component.css']
})
export class ReporteVentasTipoComponent implements OnInit {
  reportes: any[] = [];

  chartData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Total generado (Bs/)',
        data: [] as number[],
        backgroundColor: '#3B82F6'
      }
    ]
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.reporteService.obtenerReporteVentasPorTipo().subscribe(data => {
      this.reportes = data;
      this.chartData.labels = data.map((item: any) => item.tipoNombre);
      this.chartData.datasets[0].data = data.map((item: any) => item.totalGenerado);
    });
  }
}
