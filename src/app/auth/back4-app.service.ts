import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../environment';

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
  private readonly apiUrl = environment.back4App.url;
  private readonly headers = new HttpHeaders({
    'X-Parse-Application-Id': environment.back4App.appId,
    'X-Parse-REST-API-Key': environment.back4App.restApiKey,
    'Content-Type': 'application/json',
  });

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  // Common method for posting data
  private post<T>(endpoint: string, data: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}${endpoint}`, data, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // Signup
  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.post<AuthResponseData>('', {
      email,
      password,
      returnSecureToken: true,
    }).pipe(
      tap((resData) =>
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
      )
    );
  }

  // Login
  login(email: string, password: string): Observable<AuthResponseData> {
    return this.post<AuthResponseData>('', {
      email,
      password,
      returnSecureToken: true,
    }).pipe(
      tap((resData) =>
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn
        )
      )
    );
  }

  // Auto-login
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(
        new Date(userData._tokenExpirationDate).getTime() - Date.now()
      );
    }
  }

  // Logout
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  // Auto-logout after expiration
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(
      () => this.logout(),
      expirationDuration
    );
  }

  // Manage user session and token expiration
  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(Date.now() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // Error handler
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error?.error?.message) {
      errorMessage = this.getErrorMessage(errorRes.error.error.message);
    }
    return throwError(errorMessage);
  }

  // Error message mapping
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'EMAIL_EXISTS':
        return 'This email exists already';
      case 'EMAIL_NOT_FOUND':
        return 'This email does not exist.';
      case 'INVALID_PASSWORD':
        return 'This password is not correct.';
      default:
        return 'An unknown error occurred!';
    }
  }
}
