import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode"
import { isLocalStorageAvailable } from '../utils/local-storage.utils';

//Check the token is expired 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = isLocalStorageAvailable() ? localStorage.getItem('token') : null;
    let authReq = req;
    console.log('Login auth Req', authReq);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime && authReq.url != "http://localhost:8080/api/admin/userLogin") {
        this.router.navigate(['/sign-in']);
        return new Observable<HttpEvent<any>>();
      }

      //set the token with URL header
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
    }

    return next.handle(authReq);
  }
}
