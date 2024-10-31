import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { User } from './user.model';

// Define Back4App configuration details
// enviroment set
const BACK4APP_URL = 'https://parseapi.back4app.com/classes/YourClassName'; // Replace 'YourClassName' with your actual class name
const APP_ID = 'Uh4AxkKltNmyJYgnS4IJEre2H7V4oJAYKkLVQYhY'; // Application ID
const REST_API_KEY = 'gkhBdD6nIeixUPceBJjtLBlLcBF9uThWgxw8e9su'; // REST API Key

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
constructor(private http: HttpClient, private router: Router) {}

  // Method for sending POST requests
  postData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-Parse-Application-Id': APP_ID,
      'X-Parse-REST-API-Key': REST_API_KEY,
      'Content-Type': 'application/json',
    });

    // Send POST request to Back4App
    return this.http.post(BACK4APP_URL, data, { headers });
  }

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  APP_ID = 'Uh4AxkKltNmyJYgnS4IJEre2H7V4oJAYKkLVQYhY'; // Application ID
  REST_API_KEY = 'gkhBdD6nIeixUPceBJjtLBlLcBF9uThWgxw8e9su'; // REST API Key

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://parseapi.back4app.com/classes/YourClassName',

        {
          email: email,
          password: password,
          returnSecureToken: true,
        },
        {
          headers: {
            'X-Parse-Application-Id': this.APP_ID,
            'X-Parse-REST-API-Key': this.REST_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://parseapi.back4app.com/classes/YourClassName',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }
}

// https://parseapi.back4app.com/classes/YourClassName
