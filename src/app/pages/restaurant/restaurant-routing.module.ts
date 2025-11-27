import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListRestaurantComponent } from './list-restaurant/list-restaurant.component';
import { ManageRestaurantComponent } from './manage-restaurant/manage-restaurant.component';
import { ViewRestaurantMenuComponent } from './view-restaurant-menu/view-restaurant-menu.component';

const routes: Routes = [
  { path: 'list', component: ListRestaurantComponent },
  { path: 'view-menu', component: ViewRestaurantMenuComponent },
  { path: 'view/:id', component: ManageRestaurantComponent },
  { path: 'create', component: ManageRestaurantComponent },
  { path: 'update/:id', component: ManageRestaurantComponent },
  { path: 'delete/:id', component: ListRestaurantComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule { }
