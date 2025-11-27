import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMenuComponent } from './list-menu/list-menu.component';
import { ManageMenuComponent } from './manage-menu/manage-menu.component';

const routes: Routes = [
  { path: '', component: ListMenuComponent },
  { path: 'list', component: ListMenuComponent },
  { path: 'view/:id', component: ManageMenuComponent },
  { path: 'create', component: ManageMenuComponent },
  { path: 'update/:id', component: ManageMenuComponent },
  { path: 'delete/:id', component: ListMenuComponent }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class MenuRoutingModule { }
