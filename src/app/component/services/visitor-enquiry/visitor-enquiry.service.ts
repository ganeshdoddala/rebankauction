import { Injectable } from '@angular/core';
import { HttpService } from '../../agent/core/http/http.service';
import { Observable } from 'rxjs';
import { ApiMethod, AuthEndPoints } from '../../agent/core/consts';

@Injectable({
  providedIn: 'root'
})
export class VisitorEnquiryService {

  constructor(private _http: HttpService) { }

  /**
   * Send visitor enquiry data to backend
   * @param payload - Visitor enquiry data (name, email, mobile, property location, additional details)
   */
  submitVisitorEnquiry(payload: any): Observable<any> | undefined {
    return this._http.requestCall(
      AuthEndPoints.VISITOR_ENQUIRY,
      ApiMethod.POST,
      payload
    );
  }
}
