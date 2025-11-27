import { Component, OnInit } from '@angular/core';
import { Motorcycle } from 'src/app/models/motorcycle.model';
import { MotorcycleService } from 'src/app/services/motorcycle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-motorcycle',
  templateUrl: './list-motorcycle.component.html',
  styleUrls: ['./list-motorcycle.component.scss']
})
export class ListMotorcycleComponent implements OnInit {
  motorcycles: Motorcycle[] = [];

  constructor(private service: MotorcycleService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => this.motorcycles = data);
  }

  deleteMotorcycle(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: '¿Está seguro de eliminar la moto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Eliminado', 'Moto eliminada correctamente', 'success');
          this.load();
        });
      }
    });
  }
}
