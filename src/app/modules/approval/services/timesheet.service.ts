import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';
import { Timesheet } from '../model/timesheet.model';
import { ITimesheetService } from './itimesheet.service';
import { Roles } from '../../../core/constants/roles';
import { Routes } from '../../../core/constants/routes';
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

  getAllTimesheetByAuth(
    role: string,
    route: string,
    rows?: number,
    page?: number,
    filterByName?: string
  ): Observable<PagedResponse<Timesheet[]>> {
    let queryParams = `?paging=${page}&rowsPerPage=${rows}&name=${filterByName}`;

    // Condition for get timesheet by role and route
    switch (role) {
      // Role User
      case Roles.USER: {
        queryParams += `&userId=${this.currentUser$.value?.id}`;

        if (route === Routes.ONPROGRESS) {
          queryParams += '&status=pending:accepted';
        } else if (route === Routes.HISTORY) {
          queryParams += '&status=denied:approved:rejected';
        }

        break;
      }

      // Role Admin
      case Roles.ADMIN: {
        if (route === Routes.ONPROGRESS) {
          queryParams += '&status=pending:accepted';
        } else if (route === Routes.HISTORY) {
          queryParams += '&status=denied:approved:rejected';
        }

        break;
      }

      // Role Manager
      case Roles.MANAGER: {
        if (route === Routes.ONPROGRESS) {
          queryParams += '&status=pending';
        } else if (route === Routes.HISTORY) {
          queryParams += '&status=accepted:denied';
        }

        break;
      }

      // Role Benefit
      case Roles.BENEFIT: {
        if (route === Routes.ONPROGRESS) {
          queryParams += '&status=accepted';
        } else if (route === Routes.HISTORY) {
          queryParams += '&status=approved:rejected';
        }

        break;
      }
    }

    // Get Timesheet
    try {
      console.log(queryParams);

      return this.http.get<PagedResponse<Timesheet[]>>(
        API_ENDPOINT.TIMESHEET + queryParams
      );
    } catch (error: any) {
      return error.message;
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
