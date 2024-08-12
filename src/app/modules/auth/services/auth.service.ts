import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { API_ENDPOINT } from "../../../core/constants/api-endpoint";
import { SingleResponse } from "../../../core/models/api.model";
import { UserInfo } from "../../../core/models/user-info.model";
import { SessionService } from "../../../core/services/session.service";
import { LoginRequest, LoginResponse } from "../models/auth.model";
import {IAuthInterface} from "./iauth.interface";

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthInterface {
  currentUser: UserInfo | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {
    this.sessionService.token$.subscribe(() => {
      this.currentUser = this.sessionService.getCurrentUser();
    });
  }

  // get currentUser(): UserInfo | null {
  //   return this.currentUser$.value;
  // }

  login(payload: LoginRequest): Observable<SingleResponse<LoginResponse>> {
    try {
      return this.http
        .post<SingleResponse<LoginResponse>>(API_ENDPOINT.AUTH.LOGIN, payload)
        .pipe(
          map((response) => {
            this.sessionService.setToken(response.data.token);
            // this.currentUser$.next(this.sessionService.getCurrentUser());
            return response;
          })
        );
    } catch (error: any) {
      return error.message;
    }
  }

  loginDummy(): Observable<string> {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNVQk9XTyIsImlhdCI6MTUxNjIzOTAyMiwiaWQiOiI2NTUzNiIsImVtYWlsIjoic3Vib3dAbWFpbC5jb20iLCJyb2xlIjoiQURNSU4ifQ.A_fASBjH2u-vuAdpKRN-evWN_NnxbjF5QiwQ-eAZFkM';
    this.sessionService.set('token', token);
    // this.currentUser$.next(this.sessionService.getCurrentUser());
    return of(token);
  }

  logout(): void {
    // this.currentUser$.next(null);
    // this.sessionService.clearSession();
    this.sessionService.clearToken();
  }
}
