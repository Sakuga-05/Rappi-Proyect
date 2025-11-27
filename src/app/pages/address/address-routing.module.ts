import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAddressComponent } from './list-address/list-address.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';

const routes: Routes = [
  { path: 'list', component: ListAddressComponent },
  { path: 'create', component: ManageAddressComponent },
  { path: 'update/:id', component: ManageAddressComponent },
  { path: 'view/:id', component: ManageAddressComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule { }
