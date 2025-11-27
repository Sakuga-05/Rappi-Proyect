import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'src/app/models/address.model';
import { Order } from 'src/app/models/order.model';
import { AddressService } from 'src/app/services/address.service';
import { OrderService } from 'src/app/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.component.html',
  styleUrls: ['./manage-address.component.scss']
})
export class ManageAddressComponent implements OnInit {
  form: FormGroup;
  id?: number;
  orders: Order[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AddressService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      order_id: ['', Validators.required],
      street: ['', Validators.required],
      city: [''],
      country: [''],
      postal_code: ['']
    });
  }

  ngOnInit(): void {
    this.orderService.getAll().subscribe(data => this.orders = data);
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.service.getById(this.id).subscribe(a => this.form.patchValue(a));
      }
    })
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const address: Address = { ...(this.form.value as Address) } as Address;
    if (this.id) {
      address.id = this.id;
      this.service.update(address).subscribe(() => { Swal.fire('Actualizado','OK','success'); this.router.navigate(['/addresses/list']); });
    } else {
      this.service.create(address).subscribe(() => { Swal.fire('Creado','OK','success'); this.router.navigate(['/addresses/list']); });
    }
  }
}
