import { inject, Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import {
  Status,
  Timesheet,
  TimesheetResponse,
  WorkOption,
} from '../model/timesheet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagedResponse } from '../../../core/models/api.model';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { jwtDecode } from 'jwt-decode';
import { token } from '../../../core/interceptor/request.interceptor.ts';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private readonly http = inject(HttpClient);

  private fetchWorkData: WorkOption[] = [];
  private fetchTimesheetData: Timesheet[] = [];
  private fetchTimesheetDataID: TimesheetResponse = {} as TimesheetResponse;
  private apiUrl = API_ENDPOINT.TIMESHEET;

  private date: Date = new Date();
  private readonly token = token;

  GetTimesheet(): Observable<Timesheet[]> {
    const monthNow = this.date.getMonth() + 1;
    const decodedToken: any = jwtDecode(this.token);

    const reqUrl = `${API_ENDPOINT.TIMESHEET}?userId=${decodedToken.id}&status=created`;
    return this.http.get<{ data: Timesheet[] }>(reqUrl).pipe(
      map((response) => {
        this.fetchTimesheetData = response.data;

        return this.fetchTimesheetData;
      }),
      catchError((error) => {
        this.fetchTimesheetData = [];
        return of(this.fetchTimesheetData);
      })
    );
  }

  GetTimesheetById(id: any): Observable<TimesheetResponse> {
    const reqUrl = `${this.apiUrl}/${id}`;

    return this.http.get<{ data: TimesheetResponse }>(reqUrl).pipe(
      map((response) => {
        // console.log('Fetch Work Data:', response.data.timeSheetDetails);
        const timesheet = {
          ...response.data,
          status: Status.Pending,
        };

        this.fetchTimesheetDataID = timesheet;
        return this.fetchTimesheetDataID;
      }),
      catchError((error) => {
        // console.error('Error fetching work options:', error);
        return of();
      })
    );
  }

  SaveTimesheet(timesheet: Timesheet): Observable<any> {
    const reqUrl = `${this.apiUrl}/`;

    return this.http.post(reqUrl, timesheet).pipe(
      tap((response) => {
        // console.log('Timesheet saved successfully:', response);
      }),
      catchError((error) => {
        // console.error('Error saving timesheet:', error);
        return throwError(error);
      })
    );
  }

  UpdateTimesheet(id: any, timesheet: Timesheet): Observable<any> {
    const reqUrl = `${this.apiUrl}/${id}`;

    return this.http.put(reqUrl, timesheet).pipe(
      tap((response) => {
        // console.log('Timesheet edited successfully:', response);
      }),
      catchError((error) => {
        // console.error('Error Edited timesheet:', error);
        return throwError(error);
      })
    );
  }

  DeleteTimesheet(id: any): Observable<any> {
    const reqUrl = `${this.apiUrl}/${id}`;

    return this.http.delete(reqUrl).pipe(
      tap((response) => {
        // console.log('Timesheet deleted successfully:', response);
      }),
      catchError((error) => {
        // console.error('Error deleting timesheet:', error);
        return throwError(error);
      })
    );
  }

  SubmitTimesheet(id: any): Observable<any> {
    const reqUrl = `${this.apiUrl}/${id}/submit`;

    return this.http.put(reqUrl, {}).pipe(
      tap((response) => {
        // console.log('Timesheet submited successfully:', response);
      }),
      catchError((error) => {
        // console.error('Error submiting timesheet:', error);
        return throwError(error);
      })
    );
  }

  GetWorkOptions(): WorkOption[] {
    return this.fetchWorkData;
  }

  fethcWorkOptions(): Observable<WorkOption[]> {
    return this.http.get<PagedResponse<WorkOption[]>>(API_ENDPOINT.WORK).pipe(
      map((response) => {
        this.fetchWorkData = response.data;
        // console.log('Fetch Work Data:', this.fetchWorkData);
        return this.fetchWorkData;
      }),
      catchError((error) => {
        // console.error('Error fetching work options:', error);
        this.fetchWorkData = [];
        return of(this.fetchWorkData);
      })
    );
  }
}
