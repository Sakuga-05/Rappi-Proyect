import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  form: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = +params['id'];
        this.service.getById(this.id).subscribe(u => this.form.patchValue(u));
      }
    })
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const user: User = { ...(this.form.value as User) } as User;
    if (this.id) {
      user.id = this.id;
      this.service.update(user).subscribe(() => { Swal.fire('Actualizado','OK','success'); this.router.navigate(['/users/list']); });
    } else {
      this.service.create(user).subscribe(() => { Swal.fire('Creado','OK','success'); this.router.navigate(['/users/list']); });
    }
  }
}
