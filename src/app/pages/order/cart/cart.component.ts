import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  customerId: number | null = null;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });

    // Obtener el ID del cliente del localStorage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.customerId = user.id;
    }
  }

  removeItem(menuId: number): void {
    this.cartService.removeItem(menuId);
  }

  updateQuantity(menuId: number, quantity: number): void {
    this.cartService.updateQuantity(menuId, quantity);
  }

  checkout(): void {
    if (!this.customerId) {
      Swal.fire('Error', 'Debe estar autenticado para crear un pedido', 'error');
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartItems.length === 0) {
      Swal.fire('Error', 'El carrito está vacío', 'error');
      return;
    }

    const order = {
      customer_id: this.customerId,
      total: this.total,
      status: 'pending'
    };

    this.orderService.create(order as any).subscribe(() => {
      Swal.fire('Éxito', 'Pedido creado correctamente', 'success');
      this.cartService.clear();
      this.router.navigate(['/orders']);
    }, (error) => {
      Swal.fire('Error', 'No se pudo crear el pedido', 'error');
      console.error(error);
    });
  }

  continueShopping(): void {
    this.router.navigate(['/restaurants/view-menu']);
  }

  clear(): void {
    Swal.fire({
      title: 'Limpiar carrito',
      text: '¿Está seguro de que desea vaciar el carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.cartService.clear();
        Swal.fire('Carrito limpiado', '', 'success');
      }
    });
  }
}
