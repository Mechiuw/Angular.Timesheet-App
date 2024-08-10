import {Observable} from "rxjs";
import {SingleResponse} from "../../../core/models/api.model";
import {LoginRequest, LoginResponse} from "../models/auth.model";

export interface IAuthInterface{
  login(payload: LoginRequest): Observable<SingleResponse<LoginResponse>>
  logout(): void
}
