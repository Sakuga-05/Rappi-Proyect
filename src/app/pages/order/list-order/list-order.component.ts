import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { MenuService } from 'src/app/services/menu.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { ProductService } from 'src/app/services/product.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.scss']
})
export class ListOrderComponent implements OnInit {
  orders: Order[] = [];
  customerMap: { [id: number]: string } = {};
  addressMap: { [id: number]: string } = {};
  orderAddressMap: { [orderId: number]: string } = {};
  menuMap: { [id: number]: { restaurantName: string; productName: string } } = {};
  restaurantMap: { [id: number]: string } = {};
  productMap: { [id: number]: string } = {};
  motorcycleMap: { [id: number]: string } = {};

  constructor(
    private service: OrderService,
    private customerService: CustomerService,
    private addressService: AddressService,
    private menuService: MenuService,
    private restaurantService: RestaurantService,
    private productService: ProductService,
    private motorcycleService: MotorcycleService
  ) { }

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll(),
      addresses: this.addressService.getAll(),
      menus: this.menuService.getAll(),
      restaurants: this.restaurantService.getAll(),
      products: this.productService.getAllProduct(),
      motorcycles: this.motorcycleService.getAll()
    }).subscribe(({ customers, addresses, menus, restaurants, products, motorcycles }) => {
      customers.forEach(c => this.customerMap[c.id] = c.name || `#${c.id}`);
      addresses.forEach(a => {
        this.addressMap[a.id] = `${a.street}, ${a.city}`;
        if (a.order_id) {
          this.orderAddressMap[a.order_id] = `${a.street}, ${a.city}`;
        }
      });
      restaurants.forEach(r => this.restaurantMap[r.id] = r.name || `#${r.id}`);
      products.forEach(p => this.productMap[p.id] = p.name || `#${p.id}`);
      motorcycles.forEach(m => this.motorcycleMap[m.id] = m.license_plate || `#${m.id}`);
      
      menus.forEach(m => {
        this.menuMap[m.id] = {
          restaurantName: this.restaurantMap[m.restaurant_id] || `#${m.restaurant_id}`,
          productName: this.productMap[m.product_id] || `#${m.product_id}`
        };
      });
      
      this.load();
    }, (err) => {
      console.error('Error loading data', err);
      this.load();
    });
  }

  load() { this.service.getAll().subscribe(data => this.orders = data); }

  getCustomerName(id: number) {
    return this.customerMap[id] ?? `#${id}`;
  }

  getAddressInfo(id?: number) {
    if (!id) return 'Sin dirección';
    return this.addressMap[id] ?? `#${id}`;
  }

  getAddressByOrderId(orderId?: number) {
    if (!orderId) return 'Sin dirección';
    return this.orderAddressMap[orderId] ?? 'Sin dirección';
  }

  getMenuInfo(id?: number) {
    if (!id) return { restaurantName: 'Sin menú', productName: 'N/A' };
    return this.menuMap[id] ?? { restaurantName: `#${id}`, productName: 'N/A' };
  }

  getMotorcyclePlate(id?: number) {
    if (!id) return 'Sin moto';
    return this.motorcycleMap[id] ?? `#${id}`;
  }

  deleteOrder(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar pedido?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }
}
