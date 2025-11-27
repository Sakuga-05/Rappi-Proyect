import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent implements OnInit {
  form: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.service.getById(this.id).subscribe(c => this.form.patchValue(c));
      }
    })
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const customer: Customer = { ...(this.form.value as Customer) } as Customer;
    if (this.id) {
      customer.id = this.id;
      this.service.update(customer).subscribe(() => { Swal.fire('Actualizado','OK','success'); this.router.navigate(['/customers/list']); });
    } else {
      this.service.create(customer).subscribe(() => { Swal.fire('Creado','OK','success'); this.router.navigate(['/customers/list']); });
    }
  }
}
