import { Injectable } from "@angular/core";
import { SessionService } from "../../../core/services/session.service";
import { Observable } from "rxjs";
import { LoginRequest, LoginResponse } from "../models/auth.model";
import { SingleResponse } from "../../../shared/models/api.model";
import { HttpClient } from "@angular/common/http";
import { API_ENDPOINT } from "../../../core/constants/api-endpoint";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly http: HttpClient
  ) {}

  login(payload: LoginRequest): Observable<SingleResponse<LoginResponse>> {
    try {
      return this.http.post<SingleResponse<LoginResponse>>(
        API_ENDPOINT.AUTH.LOGIN,
        payload
      );
    } catch (error: any) {
      return error.message;
    }
  }
  logout(): void {
    this.sessionService.clearSession();
  }
}