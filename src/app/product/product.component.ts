import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { Product } from './product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  //load all available products
  loadProducts(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }

  addProduct(): void {
    this.router.navigate(['/add-product']);
  }

  //navgate edit product page with selected product Id
  editProduct(product: Product): void {
    console.log('Edit product', product);
    this.productService.setSelectedProductId(product.productId);
    this.productService.setEditMode(true);
    this.router.navigate(['/add-product']);
  }

  //delete product with selected product Id
  deleteProduct(productId: number): void {
    const product = this.products.find(p => p.productId === productId);
    if (product) {
      this.productService.deleteProduct(productId, product.imageId).subscribe(() => {
        this.products = this.products.filter(p => p.productId !== productId);
      });
    }
    this.loadProducts();
  }


}