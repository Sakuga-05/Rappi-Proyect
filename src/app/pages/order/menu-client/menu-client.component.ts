import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Menu } from 'src/app/models/menu.model';
import { CartService } from 'src/app/services/cart.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

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
    private cartService: CartService,
    private route: ActivatedRoute
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
      // Inicializar cantidades
      this.menus.forEach(m => this.quantities[m.id] = 1);
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

  addToCart(menu: Menu) {
    const quantity = this.quantities[menu.id] || 1;
    
    if (quantity <= 0) {
      Swal.fire('Error', 'La cantidad debe ser mayor a 0', 'error');
      return;
    }

    this.cartService.addItem({
      menuId: menu.id,
      productId: menu.product_id,
      productName: this.getProductName(menu.product_id),
      restaurantId: menu.restaurant_id,
      restaurantName: this.getRestaurantName(menu.restaurant_id),
      price: menu.price,
      quantity: quantity
    });

    Swal.fire('¡Agregado!', `${this.getProductName(menu.product_id)} agregado al carrito`, 'success');
    this.quantities[menu.id] = 1; // Reiniciar cantidad
  }
}
