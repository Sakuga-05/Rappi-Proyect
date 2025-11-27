import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DriverRoutingModule } from './driver-routing.module';
import { ListDriverComponent } from './list-driver/list-driver.component';
import { ManageDriverComponent } from './manage-driver/manage-driver.component';

@NgModule({
  declarations: [ListDriverComponent, ManageDriverComponent],
  imports: [CommonModule, DriverRoutingModule, ReactiveFormsModule]
})
export class DriverModule { }
