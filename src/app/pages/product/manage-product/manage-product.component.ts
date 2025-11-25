import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  mode: number;
  product: Product;
  theFormGroup: FormGroup;
  trySend: boolean;

  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private theFormBuilder: FormBuilder
  ) { 
    this.trySend = false;
    this.product = { id: 0 };
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
      this.product.id = this.activatedRoute.snapshot.params.id 
      this.getProduct(this.product.id) 
    }
  }

  configFormGroup() {                                 
    this.theFormGroup = this.theFormBuilder.group({
      id: [0,[]],
      name: ['', [Validators.required, Validators.min(3), Validators.max(100)]], 
      description: ['', [Validators.required, Validators.min(3), Validators.max(100)]],
      price: [0, [Validators.required,Validators.min(0.01)]],
      category: ['', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]]
    })
  }

  get getTheFormGroup() {              
    return this.theFormGroup.controls  
  }

  //Mostrar producto por ID
  getProduct(id: number) {
    this.productService.getProductById(id).subscribe({
      next: (response) => { 
        this.product = response;
        this.theFormGroup.patchValue({ 
          id: this.product.id, 
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          category: this.product.category
        });
        
        console.log('Product fetched successfully:', this.product);
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      }
    });
  }

  //Crear Producto
  createProduct() {                      
    this.trySend = true;          
    if (this.theFormGroup.invalid) { 
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.', 
        icon: 'error',
      })
      return; 
    }
    this.productService.createProduct(this.theFormGroup.value).subscribe({ 
      next: (product) => {
        console.log('Product created successfully:', product);
        Swal.fire({
          title: 'Creado!',
          text: 'Producto creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/products/list']);  // Navegar de vuelta a la lista de teatros después de la creación exitosa
      },
      error: (error) => {
        console.error('Error creating theater:', error);
      }
    });
  }

  //Actualizar Producto
  upProduct() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.productService.updateProduct(this.theFormGroup.value).subscribe({  
      next: (product) => {
        console.log('Theater updated successfully:', product);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/products/list']);
      },
      error: (error) => {
        console.error('Error updating theater:', error);
      }
    });
  }

  //Función para volver a la tabla con todos los productos
  back() {
    this.router.navigate(['/products/list']);
  }
}
