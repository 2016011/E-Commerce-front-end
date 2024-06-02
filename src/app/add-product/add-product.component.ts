import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { ProductService } from '../product/product.service';
import { environment } from '../../environment';
import { isLocalStorageAvailable } from '../utils/local-storage.utils';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit, OnDestroy {
  private baseUrl = environment.BASE_URL;

  productId: number = 0;
  productName: string = '';
  productDescription: string = '';
  productPrice: number = 0;
  stockQuantity: number = 0;
  soledQuantity: number = 0;
  imageId: number = 0;
  productImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isEditMode: boolean = false;

  constructor(private productService: ProductService, private http: HttpClient) { }

  ngOnInit(): void {
    this.isEditMode = this.productService.getEditMode();
    const productId = this.productService.getSelectedProductId();
    if (productId !== null && this.isEditMode) {
      this.productId = productId;
      this.getProductDetails(productId);
    }
  }

  ngOnDestroy(): void {
    this.productService.setEditMode(false);
    this.clearForm();
  }

  //get All Product details
  getProductDetails(productId: number): void {
    this.http.get<any>(`${this.baseUrl}/product/get/${productId}`).subscribe((data) => {
      this.productId = data.productId;
      this.productName = data.productName;
      this.productDescription = data.productDescription;
      this.productPrice = data.productPrice;
      this.stockQuantity = data.stockQuantity;
      this.soledQuantity = data.soledQuantity;
      this.imageId = data.imageId;
      if (this.imageId !== null) {
        this.loadProductImage(this.imageId);
      }
    });
  }
  //load product images
  loadProductImage(imageId: number): void {
    this.http.get(`${this.baseUrl}/image/getImage/${imageId}`, { responseType: 'blob' }).subscribe((imageBlob) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(imageBlob);
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.productImage = event.target.files[0];
      if (this.productImage) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(this.productImage);
      }
    }
  }

  //submit product data
  onSubmit() {
    const formData = new FormData();
    const token = isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    
    const productDto = {
      productId: this.isEditMode ? this.productId : 0,
      productName: this.productName,
      productDescription: this.productDescription,
      productPrice: this.productPrice,
      stockQuantity: this.stockQuantity,
      soledQuantity: this.isEditMode ? this.soledQuantity : 0, 
      imageId: this.isEditMode ? this.imageId : 0,
      file: null
    };
    formData.append('productDto', JSON.stringify(productDto));

    if (this.productImage !== null) {
      formData.append('addImageFile', this.productImage, this.productImage.name);
    }  
    this.http.post(`${this.baseUrl}/product/create/product`, formData)
      .subscribe(
        response => {
          alert('Product Created successfully');
        },
        error => {
          console.error('Product create failed', error);
          alert('product create failed');
        }
      );
  }

  clearForm() {
    this.productName = '';
    this.productDescription = '';
    this.productPrice = 0;
    this.stockQuantity = 0;
    this.productImage = null;
    this.imagePreview = null;
    this.productId = 0; 
    this.soledQuantity = 0;
    this.isEditMode = false; 
  }

}
