import { Injectable } from '@angular/core';
import { HttpService } from '../../../component/agent/core/http/http.service';
import { Observable } from 'rxjs';
import { ApiMethod, AuthEndPoints } from '../../agent/core/consts';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  constructor(private _http: HttpService) { }

  getProperties(): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.PROPERTIES,
        ApiMethod.GET,
      );
  }

  getAuctionProperties(payload:any): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.AUCTION_PROPERTIES,
        ApiMethod.POST,
        payload
      );
  }

  getPropertyDetails(id: any): Observable<any> | undefined {
    return this._http.requestCall(
        formatEndpoint(AuthEndPoints.PROPERTIESBYID, id),
        ApiMethod.GET,
      );
  }

  addProperty(property: any): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.PROPERTIES,
        ApiMethod.POST,
        property
      );
  }

  login(loginPayload: any): Observable<Object> | undefined {
      return this._http.requestCall(
        AuthEndPoints.LOGIN,
        ApiMethod.POST,
        loginPayload
      );
    }
    querySearch(payload:any): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.PROPERTIES_QUERY,
        ApiMethod.POST,
        payload
      );
    }
    delProperty(id:any): Observable<any> | undefined {
    return this._http.requestCall(
        formatEndpoint(AuthEndPoints.DEL_PROPERTIES, id),
        ApiMethod.DELETE
      );
    }

    //Private Properties
  getPrivateProperties(payload:any): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.PRIVATE_PROPERTIES,
        ApiMethod.POST,
        payload
      );
  }

  addPrivateProperty(property: any): Observable<any> | undefined {
    return this._http.requestCall(
        AuthEndPoints.POST_PRIVATE,
        ApiMethod.POST,
        property
      );
  }
    delPrivateProperty(id:any): Observable<any> | undefined {
    return this._http.requestCall(
      formatEndpoint(AuthEndPoints.PRIVATE_PROPERTIES, id),
        ApiMethod.DELETE
      );
    }

    approveProperty(id:any): Observable<any> | undefined {
    return this._http.requestCall(
      formatEndpoint(AuthEndPoints.PUT_PRIVATE, id),
        ApiMethod.PUT
      );
    }

    uploadBulkProperties(payload:any): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.UPLOAD_BULKPROPERTIES,
          ApiMethod.POST,
          payload
        );
    }

    uploadExcel(data:any){
    return this._http.requestCall(
          AuthEndPoints.UPLOAD_BULKPROPERTIES,
          ApiMethod.POST,
          data
        );
  }
}

function formatEndpoint(endpoint: AuthEndPoints, ...args: string[]): AuthEndPoints {
  const formatted = args.reduce((acc, val, idx) => acc.replace(`{${idx}}`, val), endpoint);
  return formatted as AuthEndPoints;
}

