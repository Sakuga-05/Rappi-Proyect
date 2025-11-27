import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMotorcycleComponent } from './list-motorcycle/list-motorcycle.component';
import { ManageMotorcycleComponent } from './manage-motorcycle/manage-motorcycle.component';

const routes: Routes = [
  { path: 'list', component: ListMotorcycleComponent },
  { path: 'create', component: ManageMotorcycleComponent },
  { path: 'update/:id', component: ManageMotorcycleComponent },
  { path: 'view/:id', component: ManageMotorcycleComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MotorcycleRoutingModule { }
