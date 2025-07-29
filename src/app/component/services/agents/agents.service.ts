import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthEndPoints, ApiMethod } from '../../agent/core/consts';
import { HttpService } from '../../../component/agent/core/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  constructor(private _http: HttpService) { }
  
  getAgents(): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.AGENTS,
          ApiMethod.GET,
        );
  }
  getAgentsById(id:any): Observable<any> | undefined {
      return this._http.requestCall(
          formatEndpoint(AuthEndPoints.AGENTS_ID, id),
          ApiMethod.GET,
        );
  }

  updateAgentsById(payload:any): Observable<any> | undefined {
      return this._http.requestCall(
          formatEndpoint(AuthEndPoints.AGENTS_ID, payload.id),
          ApiMethod.PUT,
          payload
        );
  }

  postAgents(payload:any): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.AGENTS,
          ApiMethod.POST,
          payload
        );
    }
  putAgents(payload:any): Observable<any> | undefined {
      return this._http.requestCall(
          AuthEndPoints.UPDATE_AGENTS,
          ApiMethod.PUT,
          payload
        );
    }
  delAgent(id:any): Observable<any> | undefined {
      return this._http.requestCall(
        formatEndpoint(AuthEndPoints.DELETE_AGENT, id),
          ApiMethod.DELETE
        );
      }
}

function formatEndpoint(endpoint: AuthEndPoints, ...args: string[]): AuthEndPoints {
  const formatted = args.reduce((acc, val, idx) => acc.replace(`{${idx}}`, val), endpoint);
  return formatted as AuthEndPoints;
}