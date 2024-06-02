import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ClientWebComponent } from './client-web/client-web.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'client-web', component: ClientWebComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'add-product', component: AddProductComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
