import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.url_backend}/customers`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.url_backend}/customers/${id}`);
  }

  create(user: User): Observable<User> {
    // backend should assign id
    delete user.id;
    return this.http.post<User>(`${environment.url_backend}/customers`, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${environment.url_backend}/customers/${user.id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/customers/${id}`);
  }
}
