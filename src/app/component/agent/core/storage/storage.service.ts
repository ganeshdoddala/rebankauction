import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private _util: UtilService) {}

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setLocalObject(key: string, value: any) {
    // console.log('in set lcoal', key, value);
    localStorage.setItem(key, this._util.encrypt(JSON.stringify(value)));
  }

  removeLoginData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    // console.log('getToken 1');
    if (typeof window !== 'undefined') {
      console.log('getToken 2', localStorage.getItem('token'));
      return localStorage.getItem('token');
    }
    return null;
  }

  // getToken() {
  //   return localStorage.getItem('token');
  // }

  removeToken() {
    localStorage.removeItem('token');
  }

  getLocalObject(key: string) {
    // console.log('in here');
    return JSON.parse(this._util.decrypt(localStorage.getItem(key) ?? ""));
  }

  getLocalvalue(key: string) {
    let value = localStorage.getItem(key);
    if (value) {
      return this._util.decrypt(value)?.replace(/^["']|["']$/g, '');
    } else return false;
  }
}
