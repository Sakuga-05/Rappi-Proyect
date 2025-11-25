import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListProductComponent,
    ManageProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
