import { Injectable } from '@angular/core';
import { HttpService } from '../../agent/core/http/http.service';
import { AuthEndPoints, ApiMethod } from '../../agent/core/consts';
import { Observable } from 'rxjs';

export interface EnquiryFormData {
  name: string;
  phoneNumber: string;
  email: string;
  propertyLocation: string;
  additionalDetails?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  constructor(private httpService: HttpService) { }

  /**
   * Submit enquiry form data to backend
   * @param formData - The enquiry form data to submit
   * @returns Observable response from the backend
   */
  submitEnquiry(formData: EnquiryFormData): Observable<any> | undefined {
    return this.httpService.requestCall(
      AuthEndPoints.ENQUIRY_FORM,
      ApiMethod.POST,
      formData
    );
  }
}
