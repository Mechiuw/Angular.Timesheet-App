import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SingleResponse } from "../../../core/models/api.model";
import { Role } from "../models/role.model";
import { API_ENDPOINT } from "../../../core/constants/api-endpoint";


@Injectable({
    providedIn: "root"
})
export class RoleService {
    constructor(
        private readonly http: HttpClient,
    ) {}

    getAllRoles(): Observable<SingleResponse<Role[]>> {
        try {
          return this.http.get<SingleResponse<Role[]>>(API_ENDPOINT.ROLES)
        } catch (error : any){
          return error.message;
        }
    }
}