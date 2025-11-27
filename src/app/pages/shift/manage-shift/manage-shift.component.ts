import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/models/driver.model';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { Shift } from 'src/app/models/shift.model';
import { DriverService } from 'src/app/services/driver.service';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import { ShiftService } from 'src/app/services/shift.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-shift',
  templateUrl: './manage-shift.component.html',
  styleUrls: ['./manage-shift.component.scss']
})
export class ManageShiftComponent implements OnInit {
  form: FormGroup;
  id?: number;
  isView: boolean = false;
  drivers: Driver[] = [];
  motorcycles: Motorcycle[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ShiftService,
    private driverService: DriverService,
    private motorcycleService: MotorcycleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      driver_id: ['', Validators.required],
      motorcycle_id: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.driverService.getAll().subscribe(data => this.drivers = data);
    this.motorcycleService.getAll().subscribe(data => this.motorcycles = data);

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.isView = this.router.url.includes('/view/');
        this.service.getById(this.id).subscribe(shift => {
          this.form.patchValue(shift);
          if (this.isView) {
            this.form.disable();
          }
        });
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const shift: Shift = { ...this.form.value } as Shift;

    if (this.id) {
      shift.id = this.id;
      this.service.update(shift).subscribe(() => {
        Swal.fire('Actualizado', 'Turno actualizado correctamente', 'success');
        this.router.navigate(['/shifts/list']);
      });
    } else {
      this.service.create(shift).subscribe(() => {
        Swal.fire('Creado', 'Turno creado correctamente', 'success');
        this.router.navigate(['/shifts/list']);
      });
    }
  }
}
