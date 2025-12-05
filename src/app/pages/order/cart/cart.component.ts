import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
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
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  showAddressForm: boolean = false;
  newAddress = {
    street: '',
    city: '',
    country: '',
    postal_code: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private addressService: AddressService,
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

  toggleAddressForm(): void {
    this.showAddressForm = !this.showAddressForm;
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

    // Solicitar datos de dirección
    Swal.fire({
      title: 'Información de Entrega',
      html: `
        <input id="street" class="swal2-input" placeholder="Calle y Número" required>
        <input id="city" class="swal2-input" placeholder="Ciudad" required>
        <input id="country" class="swal2-input" placeholder="País" required>
        <input id="postal_code" class="swal2-input" placeholder="Código Postal" required>
      `,
      confirmButtonText: 'Confirmar Pedido',
      focusConfirm: false,
      preConfirm: () => {
        const street = (document.getElementById('street') as HTMLInputElement).value;
        const city = (document.getElementById('city') as HTMLInputElement).value;
        const country = (document.getElementById('country') as HTMLInputElement).value;
        const postal_code = (document.getElementById('postal_code') as HTMLInputElement).value;

        if (!street || !city || !country || !postal_code) {
          Swal.showValidationMessage('Todos los campos son obligatorios');
          return false;
        }

        return { street, city, country, postal_code };
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        this.createOrderWithAddress(result.value);
      }
    });
  }

  createOrderWithAddress(addressData: any): void {
    // Primero crear el pedido
    const order = {
      customer_id: this.customerId,
      total: this.total,
      status: 'pending'
    };

    this.orderService.create(order as any).subscribe(createdOrder => {
      // Luego crear la dirección asociada al pedido
      const address = {
        order_id: createdOrder.id,
        street: addressData.street,
        city: addressData.city,
        country: addressData.country,
        postal_code: addressData.postal_code
      };

      this.addressService.create(address as any).subscribe(createdAddress => {
        // Actualizar el pedido con el address_id
        const updatedOrder = {
          ...createdOrder,
          address_id: createdAddress.id
        };

        this.orderService.update(updatedOrder).subscribe(() => {
          Swal.fire('Éxito', 'Pedido creado correctamente con dirección de entrega', 'success');
          this.cartService.clear();
          this.router.navigate(['/orders/list']);
        }, error => {
          console.error('Error updating order with address_id', error);
          Swal.fire('Advertencia', 'Pedido creado pero hubo un problema al asociar la dirección', 'warning');
          this.cartService.clear();
          this.router.navigate(['/orders/list']);
        });
      }, error => {
        console.error('Error creating address', error);
        Swal.fire('Advertencia', 'Pedido creado pero hubo un problema al crear la dirección', 'warning');
        this.cartService.clear();
        this.router.navigate(['/orders/list']);
      });
    }, error => {
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
