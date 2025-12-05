import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Menu } from 'src/app/models/menu.model';
import { Product } from 'src/app/models/product.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-menu',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.scss']
})
export class ManageMenuComponent implements OnInit {
  mode: number;
  menu: Menu;
  theForm: FormGroup;
  trySend = false;

  products: Product[] = [];
  restaurants: Restaurant[] = [];

  constructor(
    private fb: FormBuilder,
    private service: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private restaurantService: RestaurantService
  ) {
    this.menu = { id: 0, product_id: 0, restaurant_id: 0 };
    this.configFormGroup();
  }

  configFormGroup() {
    this.theForm = this.fb.group({
      id: [0, []],
      product_id: [0, [Validators.required]],
      restaurant_id: [0, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      availability: [true, []]
    });
  }

  ngOnInit(): void {
    // cargar productos y restaurantes para los selects
    forkJoin({
      products: this.productService.getAllProduct(),
      restaurants: this.restaurantService.getAll()
    }).subscribe({
      next: ({ products, restaurants }) => {
        this.products = products;
        this.restaurants = restaurants;
        this.initModeAndLoad();
      },
      error: (err) => {
        console.error('Error loading products/restaurants', err);
        this.initModeAndLoad();
      }
    });
  }

  initModeAndLoad() {
    const url = this.route.snapshot.url.join('/');
    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    if (this.route.snapshot.params.id) {
      this.menu.id = this.route.snapshot.params.id;
      this.getMenu(this.menu.id);
    }
  }

  getMenu(id: number) {
    this.service.getById(id).subscribe(m => {
      this.menu = m;
      this.theForm.patchValue(m as any);
    })
  }

  create() {
    this.trySend = true;
    if (this.theForm.invalid) { Swal.fire('Error','Complete los campos','error'); return; }
    this.service.create(this.theForm.value).subscribe(() => { Swal.fire('Creado','OK','success'); this.router.navigate(['/menus/list']); })
  }

  update() {
    this.trySend = true;
    if (this.theForm.invalid) { Swal.fire('Error','Complete los campos','error'); return; }
    this.service.update(this.theForm.value).subscribe(() => { Swal.fire('Actualizado','OK','success'); this.router.navigate(['/menus/list']); })
  }

  back() { this.router.navigate(['/menus/list']); }
}
