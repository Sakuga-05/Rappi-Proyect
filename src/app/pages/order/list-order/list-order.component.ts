import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Order } from 'src/app/models/order.model';
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

  constructor(
    private service: OrderService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    forkJoin({
      customers: this.customerService.getAll()
    }).subscribe(({ customers }) => {
      customers.forEach(c => this.customerMap[c.id] = c.name || `#${c.id}`);
      this.load();
    }, (err) => {
      console.error('Error loading customers map', err);
      this.load();
    });
  }

  load() { this.service.getAll().subscribe(data => this.orders = data); }

  getCustomerName(id: number) {
    return this.customerMap[id] ?? `#${id}`;
  }

  deleteOrder(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar pedido?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }
}
