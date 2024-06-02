import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  userName: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  //signin function
  signIn(): void {
    const loginUrl = 'http://localhost:8080/api/admin/userLogin';
    const loginData = {
      userName: this.userName,
      password: this.password
    };
    console.log('Login start->');
    this.http.post(loginUrl, loginData).pipe(
      catchError(error => {
        console.error('Login error', error);
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response && response.token) {
        //set the token, clientId with local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('clientId', response.clientId.toString());
        console.log('Login successful');
        this.router.navigate(['/client-web']);
      }
    });
  }

}
