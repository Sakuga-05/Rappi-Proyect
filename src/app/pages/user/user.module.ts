import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ListUserComponent } from './list-user/list-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [ListUserComponent, ManageUserComponent, UserComponent],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule]
})
export class UserModule { }
