import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Menu } from 'src/app/models/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-menu-client',
  templateUrl: './menu-client.component.html',
  styleUrls: ['./menu-client.component.scss']
})
export class MenuClientComponent implements OnInit {
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  productMap: { [id: number]: string } = {};
  restaurantMap: { [id: number]: string } = {};
  selectedRestaurantId: number | null = null;
  quantities: { [menuId: number]: number } = {};

  constructor(
    private service: MenuService,
    private productService: ProductService,
    private restaurantService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['restaurantId']) {
        this.selectedRestaurantId = parseInt(params['restaurantId']);
      }
      forkJoin({
        products: this.productService.getAllProduct(),
        restaurants: this.restaurantService.getAll()
      }).subscribe(({ products, restaurants }) => {
        products.forEach(p => this.productMap[p.id] = p.name || `#${p.id}`);
        restaurants.forEach(r => this.restaurantMap[r.id] = r.name || `#${r.id}`);
        this.load();
      }, (err) => {
        console.error('Error loading products/restaurants maps', err);
        this.load();
      });
    });
  }

  load() {
    this.service.getAll().subscribe(data => {
      this.menus = data;
      this.applyFilter();
      // Inicializar cantidades (solo para menús cargados)
      this.menus.forEach(m => this.quantities[m.id] = 1);
    });
  }

  applyFilter() {
    const isAvailable = (m: Menu) => {
      // Compatibilidad: algunos backends usan `availability`, otros `available`
      const anyM = m as any;
      if (anyM.hasOwnProperty('availability')) return !!anyM.availability;
      return true; // por defecto mostrar si no hay campo
    };

    if (this.selectedRestaurantId) {
      this.filteredMenus = this.menus.filter(m => m.restaurant_id === this.selectedRestaurantId && isAvailable(m));
    } else {
      this.filteredMenus = this.menus.filter(m => isAvailable(m));
    }
  }

  getProductName(id: number) {
    return this.productMap[id] ?? `#${id}`;
  }

  getRestaurantName(id: number) {
    return this.restaurantMap[id] ?? `#${id}`;
  }
  
  goToCreateOrder(menu: Menu) {
    console.log('Navigating to create order with menu:', menu);
    this.router.navigate(['/orders/create'], { 
      state: { selectedMenu: menu },
    });
  }
}