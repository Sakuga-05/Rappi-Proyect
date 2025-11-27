import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CartComponent } from './cart/cart.component';
import { ListOrderComponent } from './list-order/list-order.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { MenuClientComponent } from './menu-client/menu-client.component';
import { OrderRoutingModule } from './order-routing.module';

@NgModule({
  declarations: [ListOrderComponent, ManageOrderComponent, CartComponent, MenuClientComponent],
  imports: [CommonModule, OrderRoutingModule, ReactiveFormsModule, FormsModule]
})
export class OrderModule { }
