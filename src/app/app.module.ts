import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddProductComponent } from './add-product/add-product.component';
import { ClientWebComponent } from './client-web/client-web.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthInterceptor } from './interceptors/auth.service';
import { environment } from '../environment';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    AddProductComponent,
    ClientWebComponent,
    ProductDetailComponent,
    SignInComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
