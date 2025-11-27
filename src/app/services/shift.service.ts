import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Shift } from '../models/shift.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${environment.url_backend}/shifts`);
  }

  getById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${environment.url_backend}/shifts/${id}`);
  }

  create(shift: Shift): Observable<Shift> {
    delete shift.id;
    return this.http.post<Shift>(`${environment.url_backend}/shifts`, shift);
  }

  update(shift: Shift): Observable<Shift> {
    return this.http.put<Shift>(`${environment.url_backend}/shifts/${shift.id}`, shift);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/shifts/${id}`);
  }
}
