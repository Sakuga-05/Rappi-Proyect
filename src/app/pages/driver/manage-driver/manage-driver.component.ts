import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/models/driver.model';
import { DriverService } from 'src/app/services/driver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-driver',
  templateUrl: './manage-driver.component.html',
  styleUrls: ['./manage-driver.component.scss']
})
export class ManageDriverComponent implements OnInit {
  form: FormGroup;
  id?: number;
  isView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: DriverService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      license_number: ['', Validators.required],
      status: ['available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.isView = this.router.url.includes('/view/');
        this.service.getById(this.id).subscribe(driver => {
          this.form.patchValue(driver);
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

    const driver: Driver = { ...this.form.value } as Driver;

    if (this.id) {
      driver.id = this.id;
      this.service.update(driver).subscribe(() => {
        Swal.fire('Actualizado', 'Conductor actualizado correctamente', 'success');
        this.router.navigate(['/drivers/list']);
      });
    } else {
      this.service.create(driver).subscribe(() => {
        Swal.fire('Creado', 'Conductor creado correctamente', 'success');
        this.router.navigate(['/drivers/list']);
      });
    }
  }
}
