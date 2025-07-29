import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { StorageService } from '../storage/storage.service';
import { ApiMethod, AuthEndPoints } from '../consts';
import { UtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private _storage: StorageService,
    private _http: HttpService,
    private _util: UtilService
  ) {}

  fullname() {
    let userObj = this.getUserObj();
    return userObj.data.first_name.concat(' ', userObj.data.last_name);
  }

  getUserInfoByKey(key: string) {
    let userObj = this.getUserObj();
    // console.log("userObj",userObj)
    return userObj.data[key];
  }

  logoutUser() {
    return this._http.requestCall(AuthEndPoints.LOGOUT_USER, ApiMethod.POST);
  }

  getUserObj() {
    return this._storage.getLocalObject('user');
  }
  getCurrentUserData(){
    return this._http.requestCall(AuthEndPoints.CURRENR_USER, ApiMethod.GET);
  }

}
