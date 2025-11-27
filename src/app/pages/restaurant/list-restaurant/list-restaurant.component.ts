import { Component, OnInit } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-restaurant',
  templateUrl: './list-restaurant.component.html',
  styleUrls: ['./list-restaurant.component.scss']
})
export class ListRestaurantComponent implements OnInit {
  restaurants: Restaurant[] = [];
  constructor(private service: RestaurantService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe((data) => {
      this.restaurants = data;
    })
  }

  deleteRestaurant(id: number) {
    Swal.fire({
      title: 'Eliminar',
      text: 'Está seguro que quiere eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire('Eliminado!','Registro eliminado correctamente.','success');
          this.load();
        })
      }
    })
  }

}
