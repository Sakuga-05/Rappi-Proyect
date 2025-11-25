import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  products: Product[] = [];
  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.service.getAllProduct().subscribe((data) => {
      this.products = data;
    })
  }

  deleteProduct(id: number) {
    console.log("Delete theater with id:", id);
    Swal.fire({
      title: "Eliminar",
      text: "Está seguro que quiere eliminar el registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteProduct(id).subscribe((data) => {
          Swal.fire(
            "Eliminado!",
            "Registro eliminado correctamente.",
            "success"
          );
          this.ngOnInit();
        });
      }
    });
  }

}
