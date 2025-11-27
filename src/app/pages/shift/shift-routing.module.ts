import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListShiftComponent } from './list-shift/list-shift.component';
import { ManageShiftComponent } from './manage-shift/manage-shift.component';

const routes: Routes = [
  { path: 'list', component: ListShiftComponent },
  { path: 'create', component: ManageShiftComponent },
  { path: 'update/:id', component: ManageShiftComponent },
  { path: 'view/:id', component: ManageShiftComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftRoutingModule { }
