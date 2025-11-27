export interface PieDataItem {
    categoria: string;
    valor: number;
}

export interface BarDataItem {
    restaurante?: string;
    zona?: string;
    ventas?: number;
    cantidad?: number;
    calificacion?: number;
}

export interface SeriesDataItem {
    fecha: string;
    pedidos?: number;
    ingresos?: number;
    tiempo_promedio_min?: number;
}

export interface ChartPayload {
  id: string;
  titulo: string;
  datos: Array<any>;
}
