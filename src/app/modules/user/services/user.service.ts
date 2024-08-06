import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_ENDPOINT } from "../../../core/constants/api-endpoint";
import { PagedResponse } from "../../../core/models/api.model";
import { User } from "../models/user.model";
import { map, Observable } from "rxjs";
import { SessionService } from "../../../core/services/session.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}

  getUsers(): Observable<PagedResponse<User[]>> {
    try {
      return this.http.get<PagedResponse<User[]>>(API_ENDPOINT.USERS)
    } catch (error: any) {
      return error.message;
    }
  }

  getRoles(): Observable<PagedResponse<Role[]>> {
    try {
      return this.http.get<PagedResponse<Role[]>>(API_ENDPOINT.ROLES)
    } catch (error : any){
      return error.message;
    }
  }
  
}
