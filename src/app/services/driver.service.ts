import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${environment.url_backend}/drivers`);
  }

  getById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${environment.url_backend}/drivers/${id}`);
  }

  create(driver: Driver): Observable<Driver> {
    delete driver.id;
    return this.http.post<Driver>(`${environment.url_backend}/drivers`, driver);
  }

  update(driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${environment.url_backend}/drivers/${driver.id}`, driver);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/drivers/${id}`);
  }
}
