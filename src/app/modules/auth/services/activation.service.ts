import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { SingleResponse } from '../../../core/models/api.model';
import { LoginResponse } from '../models/auth.model';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
  isActivated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly http: HttpClient
  ) { }
  get isActivated(): boolean {
    return this.isActivated$.value;
  }

  activate(param: string): Observable<SingleResponse<LoginResponse>> {
    let decodedParam;
    try {
      decodedParam = atob(param);
      console.log("auth.activate : " + decodedParam);
      try {
        this.isActivated$.next(true);
        return this.http
          .get<SingleResponse<LoginResponse>>(
            `${API_ENDPOINT.AUTH.ACTIVATION}?${decodedParam}`,
            {}
          )
          .pipe(
            map((response) => {
              return response;
            })
          );
      } catch (error: any) {
        return error.message;
      }
    } catch (error: any) {
      return of(error.message);
    }
  }
}
