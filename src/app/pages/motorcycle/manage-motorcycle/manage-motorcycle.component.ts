import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-motorcycle',
  templateUrl: './manage-motorcycle.component.html',
  styleUrls: ['./manage-motorcycle.component.scss']
})
export class ManageMotorcycleComponent implements OnInit {
  form: FormGroup;
  id?: number;
  isView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: MotorcycleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.configFormGroup();
  }

  configFormGroup() {
    this.form = this.fb.group({
      license_plate: ['', Validators.required],
      brand: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900)]],
      status: ['available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.isView = this.router.url.includes('/view/');
        this.service.getById(this.id).subscribe(moto => {
          this.form.patchValue(moto);
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

    const motorcycle: Motorcycle = { ...this.form.value } as Motorcycle;

    if (this.id) {
      motorcycle.id = this.id;
      this.service.update(motorcycle).subscribe(() => {
        Swal.fire('Actualizado', 'Moto actualizada correctamente', 'success');
        this.router.navigate(['/motorcycles/list']);
      });
    } else {
      this.service.create(motorcycle).subscribe(() => {
        Swal.fire('Creado', 'Moto creada correctamente', 'success');
        this.router.navigate(['/motorcycles/list']);
      });
    }
  }
}
