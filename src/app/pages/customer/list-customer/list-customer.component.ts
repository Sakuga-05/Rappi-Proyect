import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit {
  customers: Customer[] = [];

  constructor(private service: CustomerService) { }

  ngOnInit(): void {
    this.load();
  }

  load() { this.service.getAll().subscribe(data => this.customers = data); }

  deleteCustomer(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar cliente?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }
}
