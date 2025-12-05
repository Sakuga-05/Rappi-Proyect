import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-restaurant',
  templateUrl: './manage-restaurant.component.html',
  styleUrls: ['./manage-restaurant.component.scss']
})
export class ManageRestaurantComponent implements OnInit {
  mode: number;
  restaurant: Restaurant;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router,
    private theFormBuilder: FormBuilder) { 
    this.trySend = false;
    this.restaurant = { id: 0 };
    this.configFormGroup()
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;  
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3; 
    }
    if (this.activatedRoute.snapshot.params.id) { 
      this.restaurant.id = this.activatedRoute.snapshot.params.id 
      this.getRestaurant(this.restaurant.id) 
    }
  }

  configFormGroup() {                                 
    this.theFormGroup = this.theFormBuilder.group({
      id: [0, []],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150)
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9+\-()\s]+$/), // Solo números y símbolos comunes
          Validators.minLength(6),
          Validators.maxLength(20)
        ]
      ],

      address: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200)
        ]
      ]
    });
  }

  get getTheFormGroup() {              
    return this.theFormGroup.controls  
  }

  getRestaurant(id: number) {
    this.restaurantService.getById(id).subscribe({
      next: (response) => { 
        this.restaurant = response;
        this.theFormGroup.patchValue({ 
          id: this.restaurant.id, 
          name: this.restaurant.name,
          email: this.restaurant.email,
          phone: this.restaurant.phone,
          address: this.restaurant.address
        });
      },
      error: (error) => {
        console.error('Error fetching restaurant:', error);
      }
    });
  }

  createRestaurant() {                      
    this.trySend = true;          
    if (this.theFormGroup.invalid) { 
      Swal.fire({ title: 'Error!', text: 'Por favor, complete todos los campos requeridos.', icon: 'error' })
      return; 
    }
    this.restaurantService.create(this.theFormGroup.value).subscribe({ 
      next: (res) => {
        Swal.fire({ title: 'Creado!', text: 'Restaurante creado correctamente.', icon: 'success' })
        this.router.navigate(['/restaurants/list']);
      },
      error: (error) => {
        console.error('Error creating restaurant:', error);
      }
    });
  }

  updateRestaurant() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({ title: 'Error!', text: 'Por favor, complete todos los campos requeridos.', icon: 'error' })
      return;
    }
    this.restaurantService.update(this.theFormGroup.value).subscribe({  
      next: (res) => {
        Swal.fire({ title: 'Actualizado!', text: 'Registro actualizado correctamente.', icon: 'success' })
        this.router.navigate(['/restaurants/list']);
      },
      error: (error) => {
        console.error('Error updating restaurant:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/restaurants/list']);
  }

}
