import { Component, OnInit } from '@angular/core';
import { Driver } from 'src/app/models/driver.model';
import { DriverService } from 'src/app/services/driver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-driver',
  templateUrl: './list-driver.component.html',
  styleUrls: ['./list-driver.component.scss']
})
export class ListDriverComponent implements OnInit {
  drivers: Driver[] = [];

  constructor(private service: DriverService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => this.drivers = data);
  }

  deleteDriver(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar el conductor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Conductor eliminado correctamente', 'success');
          this.load();
        });
      }
    });
  }
}
