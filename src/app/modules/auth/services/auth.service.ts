import { Injectable } from "@angular/core";
import { SessionService } from "../../../core/services/session.service";
import { BehaviorSubject, map, Observable, of, Subject } from "rxjs";
import { LoginRequest, LoginResponse } from "../models/auth.model";
import { SingleResponse } from "../../../shared/models/api.model";
import { HttpClient } from "@angular/common/http";
import { API_ENDPOINT } from "../../../core/constants/api-endpoint";
import { UserInfo } from "../../../shared/models/user-info.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUser$: BehaviorSubject<UserInfo | null>;

  constructor(
    private readonly sessionService: SessionService,
    private readonly http: HttpClient
  ) {
    this.currentUser$ = new BehaviorSubject<UserInfo | null>(
      sessionService.getCurrentUser()
    );
  }

  get currentUser(): UserInfo | null {
    return this.currentUser$.value;
  }

  login(payload: LoginRequest): Observable<SingleResponse<LoginResponse>> {
    try {
      return this.http
        .post<SingleResponse<LoginResponse>>(API_ENDPOINT.AUTH.LOGIN, payload)
        .pipe(
          map((response) => {
            this.sessionService.set("token", response.data.token);
            this.currentUser$.next(this.sessionService.getCurrentUser());
            return response;
          })
        );
    } catch (error: any) {
      return error.message;
    }
  }

  loginDummy(): Observable<string> {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNVQk9XTyIsImlhdCI6MTUxNjIzOTAyMiwiaWQiOiI2NTUzNiIsImVtYWlsIjoic3Vib3dAbWFpbC5jb20iLCJyb2xlIjoiQURNSU4ifQ.A_fASBjH2u-vuAdpKRN-evWN_NnxbjF5QiwQ-eAZFkM";
    this.sessionService.set("token", token);
    this.currentUser$.next(this.sessionService.getCurrentUser());
    return of(token);
  }

  logout(): void {
    this.currentUser$.next(null);
    this.sessionService.clearSession();
  }

  activate(token: string): void{
    
  }
}
