import { Injectable } from '@angular/core';
import { HttpService } from '../../../component/agent/core/http/http.service';
import { Observable } from 'rxjs';
import { AuthEndPoints, ApiMethod } from '../../agent/core/consts';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private _http: HttpService) {
    
   }

  getEmail(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.POST_EMAIL,
          ApiMethod.GET,
        );
    }
  setEmail(payload: any): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.POST_EMAIL,
          ApiMethod.PUT,
          payload
        );
    }

    setPropertyType(payload:any): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.PROPERY_TYPE,
          ApiMethod.POST,
          payload
        );
    }
    getPropertyType(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.PROPERY_TYPE,
          ApiMethod.GET,
        );
    }
    getSubPropertyType(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.PROPERTY_SUB,
          ApiMethod.GET,
        );
    }
    getSates(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.STATE,
          ApiMethod.GET,
        );
    }
    getDistricts(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.GET_DISTRICT,
          ApiMethod.GET,
        );
    }
    getPropertyTypeAndCount(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.PROPERY_TYPE_COUNT,
          ApiMethod.GET,
        );
    }

    sendContactForm(payload:any): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.CONTACT_FORM,
          ApiMethod.POST,
          payload
        );
    }

    
}
