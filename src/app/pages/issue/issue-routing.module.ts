import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListIssueComponent } from './list-issue/list-issue.component';
import { ManageIssueComponent } from './manage-issue/manage-issue.component';

const routes: Routes = [
  { path: '', component: ListIssueComponent },
  { path: 'list', component: ListIssueComponent },
  { path: 'create', component: ManageIssueComponent },
  { path: 'update/:id', component: ManageIssueComponent },
  { path: 'view/:id', component: ManageIssueComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssueRoutingModule { }
