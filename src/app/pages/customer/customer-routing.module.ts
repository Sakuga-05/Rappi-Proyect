import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';

const routes: Routes = [
  { path: 'list', component: ListCustomerComponent },
  { path: 'create', component: ManageCustomerComponent },
  { path: 'update/:id', component: ManageCustomerComponent },
  { path: 'view/:id', component: ManageCustomerComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
        