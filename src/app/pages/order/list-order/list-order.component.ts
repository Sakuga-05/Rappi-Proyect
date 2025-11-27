import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
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

  constructor(
    private service: OrderService,
    private customerService: CustomerService,
    private addressService: AddressService
  ) { }

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll(),
      addresses: this.addressService.getAll()
    }).subscribe(({ customers, addresses }) => {
      customers.forEach(c => this.customerMap[c.id] = c.name || `#${c.id}`);
      addresses.forEach(a => this.addressMap[a.id] = `${a.street}, ${a.city}`);
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

  deleteOrder(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar pedido?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }
}
