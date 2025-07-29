import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from '../../core/storage/storage.service';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/http/http.service';
import { AuthEndPoints, ApiMethod } from '../../core/consts';
import { CurrentUserResponse } from '../../models/current-user-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  constructor(
    private _http: HttpService,
    private _storage: StorageService,
    private _router: Router
  ) {}

  getAuthorizationToken() {
    // console.log('getAuthorizationToken');
    return this._storage.getToken();
  }

  verifyToken() {
    return this._http.requestCall(AuthEndPoints.VERIFY_TOKEN, ApiMethod.GET);
  }

  login(loginPayload: any): Observable<Object> | undefined {
    return this._http.requestCall(
      AuthEndPoints.LOGIN,
      ApiMethod.POST,
      loginPayload
    );
  }

  logoutUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  currentUser(): void {
    this._http
      .requestCall(AuthEndPoints.CURRENR_USER, ApiMethod.GET)?.subscribe({
        next: res => {
          const response = res as CurrentUserResponse;
          this._storage.setToken(response.data.token.access);
          return res;
        },
        error: error => {
          console.error(error);
        }
      });
  }

  canActivate(): boolean {
     console.log("canActivate", this.getAuthorizationToken()==null)
    if (!this.getAuthorizationToken()) {
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
