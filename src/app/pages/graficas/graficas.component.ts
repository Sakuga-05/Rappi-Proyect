import { Component, OnInit } from '@angular/core';
import { GraficasService } from 'src/app/services/graficas.service';
import { forkJoin } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ChartPayload } from 'src/app/models/graficas.model';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss']
})
export class GraficasComponent implements OnInit {
  ids = [    
    
    'circular1','circular2','circular3',
    'barras1','barras2','barras3',
    'serie1','serie2','serie3'
  ]

  // Storage para cada configuración de Chart.js
  pieConfigs: Array<{title:string, data: ChartConfiguration<'pie'>}> = [];
  barConfigs: Array<{title:string, data: ChartConfiguration<'bar'>}> = [];
  lineConfigs: Array<{title:string, data: ChartConfiguration<'line'>}> = [];

  loading = true;
  error: string | null = null;

  // Opciones generales (puedes ajustar)
  pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false }
    }
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true }
    }
  };

  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: true },
      y: { beginAtZero: true }
    }
  };

  constructor(private dataSvc: GraficasService) {}

  ngOnInit(): void {
    const calls = this.ids.map(id => this.dataSvc.getChart(id));
    forkJoin(calls).subscribe({
      next: (responses) => {
        responses.forEach(res => this.handlePayload(res));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error cargando datos desde el mock server.';
        this.loading = false;
      }
    });
  }

  private handlePayload(payload: ChartPayload) {
    const id = payload.id.toLowerCase();

    if (id.startsWith('circular')) {
      const labels = payload.datos.map((d: any) => d.categoria ?? d.label ?? 'sin etiqueta');
      const values = payload.datos.map((d: any) => Number(d.valor ?? 0));
      const data: ChartConfiguration<'pie'> = {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              data: values,
              label: payload.titulo
            }
          ]
        },
        options: this.pieOptions
      };
      this.pieConfigs.push({ title: payload.titulo, data });
      return;
    }

    if (id.startsWith('barras')) {
      // soporta distintos shapes (restaurante, zona, ventas, cantidad, calificacion)
      const first = payload.datos[0] || {};
      const labelKey = first.restaurante ? 'restaurante' : (first.zona ? 'zona' : Object.keys(first)[0]);
      const valueKey = first.ventas ? 'ventas' : (first.cantidad ? 'cantidad' : (first.calificacion ? 'calificacion' : Object.keys(first).find(k => k !== labelKey)));
      const labels = payload.datos.map((d: any) => d[labelKey] ?? 'sin etiqueta');
      const values = payload.datos.map((d: any) => Number(d[valueKey] ?? 0));

      const data: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              data: values,
              label: payload.titulo
            }
          ]
        },
        options: this.barOptions
      };
      this.barConfigs.push({ title: payload.titulo, data });
      return;
    }

    if (id.startsWith('serie')) {
      // Asumimos array de {fecha: 'YYYY-MM-DD', <valorKey>: number}
      const first = payload.datos[0] || {};
      const valueKey = Object.keys(first).find(k => k !== 'fecha') ?? Object.keys(first)[1];
      const labels = payload.datos.map((d: any) => d.fecha);
      const values = payload.datos.map((d: any) => Number(d[valueKey] ?? 0));

      const data: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              data: values,
              label: payload.titulo,
              fill: false,
              tension: 0.2
            }
          ]
        },
        options: this.lineOptions
      };
      this.lineConfigs.push({ title: payload.titulo, data });
      return;
    }

    // si no coincide, lo documentamos en consola
    console.warn('Payload no procesado (id):', payload.id);
  }
}
