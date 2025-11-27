import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUserComponent } from './list-user/list-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  { path: 'list', component: ListUserComponent },
  { path: 'create', component: ManageUserComponent },
  { path: 'update/:id', component: ManageUserComponent },
  { path: 'view/:id', component: ManageUserComponent },
  { path: '', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
