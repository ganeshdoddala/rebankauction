import { Injectable } from '@angular/core';
import { AuthEndPoints, ApiMethod } from '../consts';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { CurrentUserResponse } from '../../models/current-user-response.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient) {}

  requestCall(
    endpoint: AuthEndPoints,
    method: ApiMethod,
    data?: any
  ): Observable<Object> | undefined {
    // var response: Observable<Object>;
    var response;

    const accessToken = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    switch (method) {
      case ApiMethod.GET:
        response = this.http
          .get(`${environment.API_URL}${endpoint}`, { headers })
          .pipe(
            map(res => {
              console.log('Raw response:', res);
              return res;
            }),
            catchError(err => this.handleError(err))
          );
        break;

      case ApiMethod.POST:
        console.log(`${environment.API_URL}${endpoint}`)
        response = this.http
          .post(`${environment.API_URL}${endpoint}`, data, { headers })
          .pipe(catchError(err => this.handleError(err)));
        break;

      case ApiMethod.UPLOAD:
        response = this.http
          .post(`${environment.API_URL}${endpoint}`, data, { headers })
          .pipe(catchError(err => this.handleError(err)));
        break;

      case ApiMethod.PUT:
        response = this.http
          .put(`${environment.API_URL}${endpoint}`, data, { headers })
          .pipe(catchError(err => this.handleError(err)));
        break;

      case ApiMethod.DELETE:
        response = this.http
          .delete(`${environment.API_URL}${endpoint}`, { headers })
          .pipe(catchError(err => this.handleError(err)));
        break;

      default:
        break;
    }
    return response;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred:', error.error.message);
      errorMessage = error.error.message;
    } else {
      // call error service here
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      return throwError({ error: error.message, status: error.status });
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
