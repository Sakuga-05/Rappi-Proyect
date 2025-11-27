import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDriverComponent } from './list-driver/list-driver.component';
import { ManageDriverComponent } from './manage-driver/manage-driver.component';

const routes: Routes = [
  { path: 'list', component: ListDriverComponent },
  { path: 'create', component: ManageDriverComponent },
  { path: 'update/:id', component: ManageDriverComponent },
  { path: 'view/:id', component: ManageDriverComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
