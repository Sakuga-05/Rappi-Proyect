import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

    getAllProduct(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.url_backend}/products`);
  }

  createProduct(newProduct: Product): Observable<Product> {
    delete newProduct.id;
    return this.http.post<Product>(`${environment.url_backend}/products`, newProduct);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.url_backend}/products/${id}`);
  }

  updateProduct(theProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.url_backend}/products/${theProduct.id}`, theProduct);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${environment.url_backend}/products/${id}`);
  }
}
