import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Motorcycle } from '../models/motorcycle.model';

@Injectable({
  providedIn: 'root'
})
export class MotorcycleService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(`${environment.url_backend}/motorcycles`);
  }

  getById(id: number): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${environment.url_backend}/motorcycles/${id}`);
  }

  create(motorcycle: Motorcycle): Observable<Motorcycle> {
    delete motorcycle.id;
    return this.http.post<Motorcycle>(`${environment.url_backend}/motorcycles`, motorcycle);
  }

  update(motorcycle: Motorcycle): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${environment.url_backend}/motorcycles/${motorcycle.id}`, motorcycle);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/motorcycles/${id}`);
  }
}
