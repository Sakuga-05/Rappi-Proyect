import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';

@NgModule({
  declarations: [ListCustomerComponent, ManageCustomerComponent],
  imports: [CommonModule, CustomerRoutingModule, ReactiveFormsModule]
})
export class CustomerModule { }
