import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { Order } from 'src/app/models/order.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { Menu } from 'src/app/models/menu.model';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  form: FormGroup;
  id?: number;
  customers: Customer[] = [];
  motorcycles: Motorcycle[] = [];
  selectedMenu?: Menu;

  constructor(
    private fb: FormBuilder,
    private service: OrderService,
    private customerService: CustomerService,
    private motorcycleService: MotorcycleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      customer_id: ['', Validators.required],
      motorcycle_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['pending']
    });
  }

  ngOnInit(): void {
    this.customerService.getAll().subscribe(data => this.customers = data);
    this.motorcycleService.getAll().subscribe(data => this.motorcycles = data);
    console.log(this.motorcycles)
    // Read selected menu passed via navigation state (from menu client)
    const stateMenu = (history && (history as any).state) ? (history as any).state.selectedMenu : null;
    if (stateMenu) {
      this.selectedMenu = stateMenu as Menu;
    }

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.service.getById(this.id).subscribe(o => this.form.patchValue(o));
      }
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const formValue = this.form.value as any;
    const order: Order = { ...(formValue as Order) } as Order;

    // If user came from a menu, attach menu_id and compute total
    if (this.selectedMenu) {
      order.menu_id = this.selectedMenu.id;
      const qty = Number(formValue.quantity) || 1;
      order.total = (Number(this.selectedMenu.price || 0) * qty);
    }

    if (this.id) {
      order.id = this.id;
      this.service.update(order).subscribe(() => { Swal.fire('Actualizado','OK','success'); this.router.navigate(['/orders/list']); });
    } else {
      this.service.create(order).subscribe(() => { Swal.fire('Creado','OK','success'); this.router.navigate(['/orders/list']); });
    }
  }
}
