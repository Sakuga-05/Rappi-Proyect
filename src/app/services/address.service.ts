import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.url_backend}/addresses`);
  }

  getById(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_backend}/addresses/${id}`);
  }

  create(address: Address): Observable<Address> {
    delete address.id;
    return this.http.post<Address>(`${environment.url_backend}/addresses`, address);
  }

  update(address: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_backend}/addresses/${address.id}`, address);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/addresses/${id}`);
  }
}
