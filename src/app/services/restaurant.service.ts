import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Restaurant } from '../models/restaurant.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${environment.url_backend}/restaurants`);
  }

  create(newRestaurant: Restaurant): Observable<Restaurant> {
    delete newRestaurant.id;
    return this.http.post<Restaurant>(`${environment.url_backend}/restaurants`, newRestaurant);
  }

  getById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${environment.url_backend}/restaurants/${id}`);
  }

  update(restaurant: Restaurant): Observable<Restaurant> {
    return this.http.put<Restaurant>(`${environment.url_backend}/restaurants/${restaurant.id}`, restaurant);
  }

  delete(id: number): Observable<Restaurant> {
    return this.http.delete<Restaurant>(`${environment.url_backend}/restaurants/${id}`);
  }
}
