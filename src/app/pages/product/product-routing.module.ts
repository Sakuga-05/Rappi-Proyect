import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductComponent } from './list-product/list-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';

const routes: Routes = [
  {
    path: "list",
    component: ListProductComponent
  },
    {
    path: "view/:id",
    component: ManageProductComponent
  },
  {
    path: "create",
    component: ManageProductComponent
  },
  {
    path: "update/:id",
    component: ManageProductComponent
  },
  {
    path: "delete/:id",
    component: ListProductComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
