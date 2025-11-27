import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddressRoutingModule } from './address-routing.module';
import { ListAddressComponent } from './list-address/list-address.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';

@NgModule({
  declarations: [ListAddressComponent, ManageAddressComponent],
  imports: [CommonModule, AddressRoutingModule, ReactiveFormsModule]
})
export class AddressModule { }
