import { Injectable } from '@angular/core';
import { HttpService } from '../../../component/agent/core/http/http.service';
import { Observable } from 'rxjs';
import { ApiMethod, AuthEndPoints } from '../../agent/core/consts';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {

  constructor(private _http: HttpService) { }

  getStates(): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.GET_STATE,
        ApiMethod.GET,
      );
  }
}
