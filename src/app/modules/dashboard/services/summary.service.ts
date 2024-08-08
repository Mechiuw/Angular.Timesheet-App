import { Role } from "./../../role/models/role.model";
import { Injectable } from "@angular/core";
import { ISummaryService } from "./isummary.interface";
import { map, Observable } from "rxjs";
import { PagedResponse } from "../../../core/models/api.model";
import {
  Timesheet,
  TimesheetSummary,
} from "../../approval/model/timesheet.model";
import { HttpClient } from "@angular/common/http";
import { API_ENDPOINT } from "../../../core/constants/api-endpoint";
import { AuthService } from "../../auth/services/auth.service";
import { Roles } from "../../../core/constants/roles";
import { StatusTimesheets } from "../../../core/constants/status-timesheets";

@Injectable({
  providedIn: "root",
})
export class SummaryService implements ISummaryService {
  role!: string 
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.role = this.authService.currentUser?.role! || '';
  }

  year: number = new Date().getFullYear();
  month: number = new Date().getMonth();
  params: string = `?rowsPerPage=10000&year=${this.year}&period=${this.month}:${
    this.month + 1
  }`;

  getMonthReport(): Observable<PagedResponse<Timesheet[]>> {
    let params = status;
    return this.http
      .get<PagedResponse<Timesheet[]>>(API_ENDPOINT.TIMESHEET + params)
  }
  // getSummaryTrend(): Observable<any> {
  //   const top = this.month
  //   const bottom = top - 6
  //   let params: string = `?rowsPerPage=10000&year=${this.year}&period=${bottom}:${this.month}`
  //   console.log(params);
  //   return this.http
  //     .get<PagedResponse<Timesheet[]>>(API_ENDPOINT.TIMESHEET + params)
      
  // }
  getSummary(): Observable<PagedResponse<TimesheetSummary[]>> {
    

    let status = "&status=";

    if (this.role === Roles.MANAGER) {
      status += `${StatusTimesheets.PENDING}`;
    } else if (this.role === Roles.BENEFIT) {
      status += `${StatusTimesheets.ACCEPTED}`;
    } else if (this.role === Roles.ADMIN) {
      status += `${StatusTimesheets.PENDING}:${StatusTimesheets.ACCEPTED}:${StatusTimesheets.APPROVED}`;
    } else status = `&userId=${this.authService.currentUser?.id}`;

    this.params += status;
    return this.http
      .get<PagedResponse<TimesheetSummary[]>>(
        API_ENDPOINT.TIMESHEET + this.params
      )
      .pipe(
        map((response) => {
          console.log(response);
          return response;
        })
      );
  }
}
