import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';
import { Timesheet } from '../model/timesheet';
import { ITimesheetService } from './itimesheet.service';
import { Roles } from '../../../core/constants/roles';
import { StatusTimesheets } from '../../../core/constants/status-timesheets';

// import for service session
import { SessionService } from '../../../core/services/session.service';
import { UserInfo } from '../../../core/models/user-info.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
  // Data user from session
  private currentUser$: BehaviorSubject<UserInfo | null>;

  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {
    this.currentUser$ = new BehaviorSubject<UserInfo | null>(
      sessionService.getCurrentUser()
    );
  }

  getAllTimesheet(params: string): Observable<PagedResponse<Timesheet[]>> {
    try {
      return this.http.get<PagedResponse<Timesheet[]>>(
        API_ENDPOINT.TIMESHEET + params
      );
    } catch (error: any) {
      return error.message;
    }
  }

  // TODO : IMPLEMENTASI SERVER SIDE PAGINATION
  // currently using client side pagination
  // currently using filter by FE
  getAllTimesheetByAuth(
    role: string,
    route: string
  ): Observable<PagedResponse<Timesheet[]>> {
    const baseUrl = API_ENDPOINT.TIMESHEET + '?rowsPerPage=1000&';

    switch (role) {
      // Role User
      case Roles.USER: {
        try {
          return this.http
            .get<PagedResponse<Timesheet[]>>(
              baseUrl + 'userId=' + this.currentUser$.value?.id
            )
            .pipe(
              map((response) => {
                const filteredData = response.data.filter((timesheet) => {
                  if (route === 'on-progress') {
                    return (
                      timesheet.status === StatusTimesheets.PENDING ||
                      timesheet.status === StatusTimesheets.ACCEPTED
                    );
                  } else if (route === 'history') {
                    return (
                      timesheet.status === StatusTimesheets.DENIED ||
                      timesheet.status === StatusTimesheets.APPROVED ||
                      timesheet.status === StatusTimesheets.REJECTED
                    );
                  } else {
                    return timesheet;
                  }
                });

                return { ...response, data: filteredData };
              })
            );
        } catch (error: any) {
          return error.message;
        }
      }
      // Role Admin
      case Roles.ADMIN: {
        try {
          return this.http
            .get<PagedResponse<Timesheet[]>>(baseUrl)
            .pipe(
              map((response) => {
                const filteredData = response.data.filter((timesheet) => {
                  if (route === 'on-progress') {
                    return (
                      timesheet.status === StatusTimesheets.PENDING ||
                      timesheet.status === StatusTimesheets.ACCEPTED
                    );
                  } else if (route === 'history') {
                    return (
                      timesheet.status === StatusTimesheets.DENIED ||
                      timesheet.status === StatusTimesheets.APPROVED ||
                      timesheet.status === StatusTimesheets.REJECTED
                    );
                  } else {
                    return timesheet;
                  }
                });

                return { ...response, data: filteredData };
              })
            );
        } catch (error: any) {
          return error.message;
        }
      }
      // Role Manager
      case Roles.MANAGER: {
        try {
          return this.http
            .get<PagedResponse<Timesheet[]>>(baseUrl)
            .pipe(
              map((response) => {
                const filteredData = response.data.filter((timesheet) => {
                  if (route === 'on-progress') {
                    return timesheet.status === StatusTimesheets.PENDING;
                  } else if (route === 'history') {
                    return (
                      timesheet.status === StatusTimesheets.ACCEPTED ||
                      timesheet.status === StatusTimesheets.DENIED
                    );
                  } else {
                    return false;
                  }
                });

                return { ...response, data: filteredData };
              })
            );
        } catch (error: any) {
          return error.message;
        }
      }
      // Role Benefit
      case Roles.BENEFIT: {
        try {
          return this.http
            .get<PagedResponse<Timesheet[]>>(baseUrl)
            .pipe(
              map((response) => {
                const filteredData = response.data.filter((timesheet) => {
                  if (route === 'on-progress') {
                    return timesheet.status === StatusTimesheets.ACCEPTED;
                  } else if (route === 'history') {
                    return (
                      timesheet.status === StatusTimesheets.APPROVED ||
                      timesheet.status === StatusTimesheets.REJECTED
                    );
                  } else {
                    return timesheet;
                  }
                });

                return { ...response, data: filteredData };
              })
            );
        } catch (error: any) {
          return error.message;
        }
      }
      default: {
        return of({} as PagedResponse<Timesheet[]>);
      }
    }
  }

  getTimesheetById(id: string): Observable<SingleResponse<Timesheet>> {
    try {
      return this.http.get<SingleResponse<Timesheet>>(
        API_ENDPOINT.TIMESHEET + '/' + id
      );
    } catch (error: any) {
      return error.message;
    }
  }

  acceptTimesheetByManager(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.MANAGER.APPROVE + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
  denyTimesheetByManager(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.MANAGER.REJECT + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
  approveTimesheetByBenefit(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.BENEFIT.APPROVE + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
  rejectTimesheetByBenefit(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.BENEFIT.REJECT + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
}
