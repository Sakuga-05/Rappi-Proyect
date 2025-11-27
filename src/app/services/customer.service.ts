import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.url_backend}/customers`);
  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.url_backend}/customers/${id}`);
  }

  create(customer: Customer): Observable<Customer> {
    delete customer.id;
    return this.http.post<Customer>(`${environment.url_backend}/customers`, customer);
  }

  update(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${environment.url_backend}/customers/${customer.id}`, customer);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/customers/${id}`);
  }
}
