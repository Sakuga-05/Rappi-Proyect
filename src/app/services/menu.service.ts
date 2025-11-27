import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Menu } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.url_backend}/menus`);
  }

  create(menu: Menu): Observable<Menu> {
    delete menu.id;
    return this.http.post<Menu>(`${environment.url_backend}/menus`, menu);
  }

  getById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${environment.url_backend}/menus/${id}`);
  }

  update(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${environment.url_backend}/menus/${menu.id}`, menu);
  }

  delete(id: number): Observable<Menu> {
    return this.http.delete<Menu>(`${environment.url_backend}/menus/${id}`);
  }
}
