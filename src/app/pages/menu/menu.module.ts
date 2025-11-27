import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ListMenuComponent } from './list-menu/list-menu.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { MenuRoutingModule } from './menu-routing.module';

@NgModule({
  declarations: [ListMenuComponent, ManageMenuComponent],
  imports: [CommonModule, MenuRoutingModule, ReactiveFormsModule]
})
export class MenuModule { }
