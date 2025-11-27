import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  menuId: number;
  productId: number;
  productName: string;
  restaurantId: number;
  restaurantName: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor() {
    // Cargar carrito del localStorage si existe
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems.next(JSON.parse(saved));
    }
  }

  addItem(item: CartItem): void {
    const current = this.cartItems.value;
    const existing = current.find(c => c.menuId === item.menuId);
    
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      current.push(item);
    }
    
    this.cartItems.next([...current]);
    this.saveToLocalStorage();
  }

  removeItem(menuId: number): void {
    const current = this.cartItems.value.filter(c => c.menuId !== menuId);
    this.cartItems.next(current);
    this.saveToLocalStorage();
  }

  updateQuantity(menuId: number, quantity: number): void {
    const current = this.cartItems.value;
    const item = current.find(c => c.menuId === menuId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(menuId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...current]);
        this.saveToLocalStorage();
      }
    }
  }

  getTotal(): number {
    return this.cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItems(): CartItem[] {
    return this.cartItems.value;
  }

  clear(): void {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }
}
