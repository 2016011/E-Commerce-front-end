import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Product } from './product.model';
import { environment } from '../../environment';
import { isLocalStorageAvailable } from '../utils/local-storage.utils';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private selectedProductId: number | null = null;
  private editMode: boolean = false;

  private baseUrl = environment.BASE_URL;

  constructor(private http: HttpClient) { }

  setSelectedProductId(id: number): void {
    this.selectedProductId = id;
  }

  getSelectedProductId(): number | null {
    return this.selectedProductId;
  }

  setEditMode(isEditMode: boolean): void {
    this.editMode = isEditMode;
  }

  getEditMode(): boolean {
    return this.editMode;
  }

  //get products function
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/product/get`).pipe(
      //tap(data => this.log(data))
      map(products => {
        return products.map(product => {
          return {
            ...product,
            imageUrl: `${this.baseUrl}/image/getImage/${product.imageId}`
          };
        });
      })
    );
  }

  private log(data: Product[]): void {
    console.log('Fetched Products:', data);
  }

  //get product by specifc Id
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/product/get/${productId}`).pipe(
      map(product => ({
        ...product,
        imageUrl: `${this.baseUrl}/image/getImage/${product.imageId}`
      }))
    );
  }

  //delete product by specific id
  deleteProduct(productId: number, imageId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/product/deleteProduct/${productId}/${imageId}`).pipe(
      catchError(error => {
        console.error('Error deleting product', error);
        return throwError(error);
      })
    );
  }

  getToken(): string | null {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
