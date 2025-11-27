import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IssueRoutingModule } from './issue-routing.module';
import { ListIssueComponent } from './list-issue/list-issue.component';
import { ManageIssueComponent } from './manage-issue/manage-issue.component';

@NgModule({
  declarations: [
    ListIssueComponent,
    ManageIssueComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IssueRoutingModule
  ]
})
export class IssueModule { }
