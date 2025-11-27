import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ListMotorcycleComponent } from './list-motorcycle/list-motorcycle.component';
import { ManageMotorcycleComponent } from './manage-motorcycle/manage-motorcycle.component';
import { MotorcycleRoutingModule } from './motorcycle-routing.module';

@NgModule({
  declarations: [ListMotorcycleComponent, ManageMotorcycleComponent],
  imports: [CommonModule, MotorcycleRoutingModule, ReactiveFormsModule]
})
export class MotorcycleModule { }
