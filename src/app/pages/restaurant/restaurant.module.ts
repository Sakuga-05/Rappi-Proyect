import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ListRestaurantComponent } from './list-restaurant/list-restaurant.component';
import { ManageRestaurantComponent } from './manage-restaurant/manage-restaurant.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { ViewRestaurantMenuComponent } from './view-restaurant-menu/view-restaurant-menu.component';

@NgModule({
  declarations: [
    ListRestaurantComponent,
    ManageRestaurantComponent,
    ViewRestaurantMenuComponent
  ],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    ReactiveFormsModule
  ]
})
export class RestaurantModule { }
