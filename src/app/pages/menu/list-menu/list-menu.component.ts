import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Menu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss']
})
export class ListMenuComponent implements OnInit {
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  productMap: { [id: number]: string } = {};
  restaurantMap: { [id: number]: string } = {};
  selectedRestaurantId: number | null = null;

  constructor(
    private service: MenuService,
    private productService: ProductService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtener parámetro de restaurante si existe
    this.route.queryParams.subscribe(params => {
      if (params['restaurantId']) {
        this.selectedRestaurantId = parseInt(params['restaurantId']);
      }
      // load products and restaurants first, then menus
      forkJoin({
        products: this.productService.getAllProduct(),
        restaurants: this.restaurantService.getAll()
      }).subscribe(({ products, restaurants }) => {
        products.forEach(p => this.productMap[p.id] = p.name || `#${p.id}`);
        restaurants.forEach(r => this.restaurantMap[r.id] = r.name || `#${r.id}`);
        this.load();
      }, (err) => {
        // even if mapping fails, still try to load menus
        console.error('Error loading products/restaurants maps', err);
        this.load();
      });
    });
  }

  load() { 
    this.service.getAll().subscribe(data => {
      this.menus = data;
      this.applyFilter();
    }); 
  }

  applyFilter() {
    if (this.selectedRestaurantId) {
      this.filteredMenus = this.menus.filter(m => m.restaurant_id === this.selectedRestaurantId);
    } else {
      this.filteredMenus = this.menus;
    }
  }

  getProductName(id: number) {
    return this.productMap[id] ?? `#${id}`;
  }

  getRestaurantName(id: number) {
    return this.restaurantMap[id] ?? `#${id}`;
  }

  deleteMenu(id: number) {
    Swal.fire({ title: 'Eliminar', text: '¿Eliminar registro?', icon: 'warning', showCancelButton: true }).then(res => {
      if (res.isConfirmed) { this.service.delete(id).subscribe(() => { Swal.fire('Eliminado','OK','success'); this.load(); }) }
    })
  }
}
