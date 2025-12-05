import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrderComponent } from './list-order/list-order.component';
import { ManageOrderComponent } from './manage-order/manage-order.component';
import { MenuClientComponent } from './menu-client/menu-client.component';

const routes: Routes = [
  { path: 'list', component: ListOrderComponent },
  { path: 'menu', component: MenuClientComponent },
  { path: 'create', component: ManageOrderComponent },
  { path: 'update/:id', component: ManageOrderComponent },
  { path: 'view/:id', component: ManageOrderComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
