import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
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

    getAllRoles(): Observable<Role[]> {
      return this.http.get<{ status: { code: number; message: string }; data: Role[] }>(API_ENDPOINT.ROLES).pipe(
        map(response => response.data)
      );
    }
}