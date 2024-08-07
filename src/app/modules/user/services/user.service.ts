import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_BASE_URL, API_ENDPOINT } from "../../../core/constants/api-endpoint";
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

 getUsers(rows: number, page: number): Observable<PagedResponse<User[]>> {
    try {
      return this.http.get<PagedResponse<User[]>>(`${API_BASE_URL}/admin/accounts?paging=${page}&rowsPerPage=${rows}`)
    } catch (error: any) {
      return error.message;
    }
  }

  filterUsersByName(name: string){
    try {
      return this.http.get<PagedResponse<User[]>>(`${API_BASE_URL}/admin/accounts?name=${name}`)
    } catch (error: any) {
      return error.message;
    }
  }

  registerUser(user:User): Observable<User> {
    return this.http.post<User>(`${API_BASE_URL}/admin/register`,user);
  }
}
