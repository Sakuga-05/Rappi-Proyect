import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-view-restaurant-menu',
  templateUrl: './view-restaurant-menu.component.html',
  styleUrls: ['./view-restaurant-menu.component.scss']
})
export class ViewRestaurantMenuComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(
    private service: RestaurantService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe((data) => {
      this.restaurants = data;
    })
  }

  viewMenu(restaurantId: number) {
    // Redirige al listado de menús filtrados por restaurante
    this.router.navigate(['/menus'], { queryParams: { restaurantId: restaurantId } });
  }
}
