import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthEndPoints, ApiMethod } from '../../agent/core/consts';
import { HttpService } from '../../agent/core/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private _http: HttpService) { }

  getSubscriptionConfig(): Observable<any> | undefined {
    return this._http.requestCall(
      AuthEndPoints.SUBSCRIBE,
      ApiMethod.GET
    );
  }

  subscribe(payload: any): Observable<any> | undefined {
    return this._http.requestCall(
      AuthEndPoints.SUBSCRIBE,
      ApiMethod.POST,
      payload
    );
  }
}
