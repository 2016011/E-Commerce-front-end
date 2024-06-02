import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isLocalStorageAvailable } from '../utils/local-storage.utils';
import { environment } from '../../environment';

interface CartItem {
  orderId: number;
  productId: number;
  orderQuantity: number;
}

@Component({
  selector: 'app-client-web',
  templateUrl: './client-web.component.html',
  styleUrl: './client-web.component.scss'
})
export class ClientWebComponent implements OnInit {

  private baseUrl = environment.BASE_URL;

  products: Product[] = [];
  selectedProduct: Product | null = null;
  orderQuantity: number = 1;
  cart: CartItem[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  //get all products
  getAllProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  //view products
  viewProduct(product: Product): void {
    console.log('View product:', product);
    this.router.navigate(['/product-detail', product.productId]);
  }

  //open Buy modal
  openBuyModal(modalTemplate: TemplateRef<any>, product: Product): void {
    if (this.isUserSignedIn()) {
      this.selectedProduct = product;
      this.modalService.open(modalTemplate, { ariaLabelledBy: 'modal-basic-title' });
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  //get available stock
  getAvailableStock(product: any): number {
    return product.stockQuantity - (product.soledQuantity || 0);
  }

  //push to the cart
  confirmBuy(modal: any): void {
    if (this.selectedProduct) {
      this.cart.push({
        orderId: 0,
        productId: this.selectedProduct.productId,
        orderQuantity: this.orderQuantity
      });

      console.log('Cart:', this.cart);

      modal.close();

      this.selectedProduct = null;
      this.orderQuantity = 1;
    }
  }

  //checkout modal open
  openCheckoutModal(content: TemplateRef<any>): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  //place the order
  placeOrder(modal: any): void {
    const token = isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    if (!token) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const order = {
      orderId: 0,
      userId: parseInt(localStorage.getItem('clientId')!, 0),
      orderConfirmation: '',
      orderStatus: '',
      productOrderList: this.cart.map(item => ({
        orderId: 0,
        productId: item.productId,
        orderQuantity: item.orderQuantity
      }))
    };

    this.http.post(`${this.baseUrl}/order/createOrder`, order, { headers })
      .subscribe(
        response => {
          alert('Order placed successfully');
          this.cart = [];
          modal.dismiss('order placed');
        },
        error => {
          console.error('Order placement failed', error);
          alert('Order placement failed');
        }
      );
  }

  isUserSignedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

}
