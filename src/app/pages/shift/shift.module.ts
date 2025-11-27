import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ListShiftComponent } from './list-shift/list-shift.component';
import { ManageShiftComponent } from './manage-shift/manage-shift.component';
import { ShiftRoutingModule } from './shift-routing.module';

@NgModule({
  declarations: [ListShiftComponent, ManageShiftComponent],
  imports: [CommonModule, ShiftRoutingModule, ReactiveFormsModule]
})
export class ShiftModule { }
