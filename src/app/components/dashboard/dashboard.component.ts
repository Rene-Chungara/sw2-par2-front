// dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    BaseChartDirective // Ensure this is here for standalone components
  ],
  providers: [DatePipe], // Provide DatePipe if needed in the component's logic
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  eficiencia = 0;
  margen = 0;

  filtroAnio: number | null = null;
  filtroMes: number | null = null;

  aniosDisponibles: number[] = [];
  mesesDisponibles: number[] = []; // This should ideally be months 1-12 or relevant filtered months

  ventasChartData: ChartData = {
    labels: [],
    datasets: [{ data: [], label: 'Ventas' }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Ventas por Categoría' }
    }
  };

  chartType: ChartType = 'bar';

  currentDateTime: Date = new Date();

  constructor(private gql: DashboardService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    // 1. Fetch available years and months from the service
    this.gql.getAniosMesesDisponiblesVentas().subscribe(data => {
      // Ensure unique and sorted years (descending for latest first)
      this.aniosDisponibles = Array.from(new Set(data.map(item => item.anio))).sort((a, b) => b - a);

      // Only populate months if a year is selected, or populate all 1-12
      // For now, let's assume all months are available or we filter them based on the selected year later.
      // If your backend gives you specific months for specific years, you might need to adjust `mesesDisponibles` when a year is selected.
      this.mesesDisponibles = Array.from(new Set(data.map(item => item.mes))).sort((a, b) => b - a);


      // 2. Set default filter values to the latest available year and month
      if (this.aniosDisponibles.length > 0) {
        this.filtroAnio = this.aniosDisponibles[0]; // Select the latest year
      }
      if (this.mesesDisponibles.length > 0) {
        this.filtroMes = this.mesesDisponibles[0]; // Select the latest month
      }

      // 3. Load data with the initial filters
      this.cargarDatos();
    });

    // Optional: Keep currentDateTime updated for display
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  // This function is called when a filter changes
  onFiltroChange(): void {
    // Only load data if both year and month are selected
    if (this.filtroAnio !== null && this.filtroMes !== null) {
      this.cargarDatos();
    } else {
      // Optionally clear data or show a message if filters are incomplete
      console.warn('Year or month filter is not selected.');
    }
  }

  cargarDatos(): void {
    // Guard clause: ensure filters are set before making API calls
    if (this.filtroAnio === null || this.filtroMes === null) {
      console.error('Cannot load data: Year or month filter is missing.');
      return;
    }

    // API calls to fetch data based on selected filters
    this.gql.getEficienciaProduccion(this.filtroAnio, this.filtroMes).subscribe(valor => {
      this.eficiencia = valor;
    });

    this.gql.getMargenBruto(this.filtroAnio, this.filtroMes).subscribe(valor => {
      this.margen = valor;
    });

    this.gql.getVentasPorCategoria(this.filtroAnio, this.filtroMes).subscribe(data => {
      this.ventasChartData = {
        labels: data.map(item => item.categoria),
        datasets: [
          {
            data: data.map(item => item.total),
            label: 'Ventas'
          }
        ]
      };
    });
  }

  getMargenColorClass(): string {
    if (this.margen < 30) return 'margen-rojo';
    if (this.margen < 50) return 'margen-naranja';
    if (this.margen < 70) return 'margen-amarillo';
    return 'margen-verde';
  }

  getMonthName(monthNumber: number | null): string {
    if (monthNumber === null) return '';
    const date = new Date(2000, monthNumber - 1, 1);
    // Ensure you have configured 'es-BO' locale or use a generic 'es' if needed
    return this.datePipe.transform(date, 'MMMM', '', 'es-BO') || '';
  }
}