import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users: User[] = [];

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.load();
  }

  load() { this.service.getAll().subscribe(data => this.users = data); }

  deleteUser(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar usuario?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }

}
