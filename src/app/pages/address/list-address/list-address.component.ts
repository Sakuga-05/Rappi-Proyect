import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Address } from 'src/app/models/address.model';
import { AddressService } from 'src/app/services/address.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-address',
  templateUrl: './list-address.component.html',
  styleUrls: ['./list-address.component.scss']
})
export class ListAddressComponent implements OnInit {
  addresses: Address[] = [];
  orderMap: { [id: number]: string } = {};

  constructor(
    private service: AddressService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    forkJoin({
      orders: this.orderService.getAll()
    }).subscribe(({ orders }) => {
      orders.forEach(o => this.orderMap[o.id] = `Pedido #${o.id}`);
      this.load();
    }, (err) => {
      console.error('Error loading orders map', err);
      this.load();
    });
  }

  load() { this.service.getAll().subscribe(data => this.addresses = data); }

  getOrderLabel(id: number) {
    return this.orderMap[id] ?? `#${id}`;
  }

  deleteAddress(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar dirección?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }
}
