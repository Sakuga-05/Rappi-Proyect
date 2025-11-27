import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChartPayload } from '../models/graficas.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  constructor(private http: HttpClient) { }

  getChart(id: string): Observable<ChartPayload> {
    const url = `${environment.url_graficas}/${id}`;
    return this.http.get<ChartPayload>(url);
  }
}
