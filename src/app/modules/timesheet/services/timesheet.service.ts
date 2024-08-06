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

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private readonly http = inject(HttpClient);

  // private dummyData: Timesheet[] = [
  //   {
  //     id: 1,
  //     userId: 1,
  //     createdAt: new Date('2024-07-03T17:00:00.000Z'),
  //     confirmedManagerBy: 'ManagerName',
  //     confirmedBenefitBy: 'BenefitName',
  //     timeSheetDetails: [
  //       {
  //         date: new Date('2024-07-03T17:00:00.000Z'),
  //         startTime: new Date('2024-07-04T02:00:00.000Z'),
  //         endTime: new Date('2024-07-04T05:00:00.000Z'),
  //         workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
  //       },
  //       {
  //         date: new Date('2024-07-05T17:00:00.000Z'),
  //         startTime: new Date('2024-07-06T02:00:00.000Z'),
  //         endTime: new Date('2024-07-06T03:00:00.000Z'),
  //         workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
  //       },
  //     ],
  //     status: Status.Pending,
  //   },
  //   {
  //     id: 2,
  //     userId: 2,
  //     createdAt: new Date('2024-08-02T08:06:19.799Z'),
  //     confirmedManagerBy: 'ManagerName',
  //     confirmedBenefitBy: 'BenefitName',
  //     timeSheetDetails: [
  //       {
  //         id: 1722585911431,
  //         date: new Date('2024-07-08T17:00:00.000Z'),
  //         startTime: new Date('2024-07-09T02:00:00.000Z'),
  //         endTime: new Date('2024-07-09T03:00:00.000Z'),
  //         workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
  //       },
  //       {
  //         id: 1722585968767,
  //         date: new Date('2024-07-09T17:00:00.000Z'),
  //         startTime: new Date('2024-07-10T03:00:00.000Z'),
  //         endTime: new Date('2024-07-10T05:00:00.000Z'),
  //         workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
  //       },
  //       {
  //         id: 1722585934135,
  //         date: new Date('2024-07-10T17:00:00.000Z'),
  //         startTime: new Date('2024-07-11T03:00:00.000Z'),
  //         endTime: new Date('2024-07-11T05:00:00.000Z'),
  //         workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
  //       },
  //     ],
  //     status: Status.OnProgress,
  //   },
  // ];

  private fetchWorkData: WorkOption[] = [];
  private fetchTimesheetData: Timesheet[] = [];
  private fetchTimesheetDataID: TimesheetResponse = {} as TimesheetResponse;
  private apiUrl = 'https://sure-pika-easy.ngrok-free.app';
  private readonly token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU1MjYxODYsImlhdCI6MTcyMjkzNDE4NiwiaXNzIjoidGltZXNoZWV0LWFwcCIsImlkIjoiYjZhZmY4ODUtZWM0My00YmU5LWJiZDItOTI5OWUxMDE4ZTNiIiwidXNlcm5hbWUiOiJBa3UgVXNlciIsImVtYWlsIjoiZXBjNDE4MDVAemNjY2suY29tIiwicm9sZSI6InVzZXIifQ.kwl94lxadVZP8b3_uFDBL_zbMjhRljL-QLRzYXlT1vQ';

  GetTimesheet(): Observable<Timesheet[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/api/v1/timesheets`;
    // console.log('Request URL:', reqUrl);

    return this.http.get<{ data: Timesheet[] }>(reqUrl, { headers }).pipe(
      map((response) => {
        // console.log('Fetch Work Data:', response.data);
        this.fetchTimesheetData = response.data.map((timesheet) => ({
          ...timesheet,
          status: Status.Pending,
        }));
        return this.sortTimesheetsByDate(this.fetchTimesheetData);
      }),
      catchError((error) => {
        // console.error('Error fetching work options:', error);
        this.fetchTimesheetData = [];
        return of(this.fetchTimesheetData);
      })
    );
  }

  private sortTimesheetsByDate(timesheets: Timesheet[]): Timesheet[] {
    return timesheets.sort((a, b) => {
      const dateA = new Date(a.createdAt!).getTime();
      const dateB = new Date(b.createdAt!).getTime();
      return dateA - dateB;
    });
  }

  GetTimesheetById(id: any): Observable<TimesheetResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/api/v1/timesheets/${id}`;
    // console.log('Request URL:', reqUrl);

    return this.http.get<{ data: TimesheetResponse }>(reqUrl, { headers }).pipe(
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
        console.error('Error fetching work options:', error);
        return of();
      })
    );
  }

  SaveTimesheet(timesheet: Timesheet): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/api/v1/timesheets/`;
    console.log('Request URL:', reqUrl);
    console.log('Save Timesheet: ' + JSON.stringify(timesheet));

    return this.http.post(reqUrl, timesheet, { headers }).pipe(
      tap((response) => {
        console.log('Timesheet saved successfully:', response);
      }),
      catchError((error) => {
        console.error('Error saving timesheet:', error);
        return throwError(error);
      })
    );
  }

  UpdateTimesheet(timesheet: Timesheet): Observable<void> {
    console.log('Update Timesheet: ' + JSON.stringify(timesheet));
    return new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
  }

  DeleteTimesheet(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/api/v1/timesheets/${id}`;
    console.log('Request URL:', reqUrl);
    console.log('Delete Timesheet: ' + JSON.stringify(id));

    return this.http.delete(reqUrl, { headers }).pipe(
      tap((response) => {
        console.log('Timesheet deleted successfully:', response);
      }),
      catchError((error) => {
        console.error('Error deleting timesheet:', error);
        return throwError(error);
      })
    );
  }

  GetWorkOptions(): WorkOption[] {
    return this.fetchWorkData;
  }

  fethcWorkOptions(): Observable<WorkOption[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'ngrok-skip-browser-warning': 'true',
    });

    const reqUrl = `${this.apiUrl}/api/v1/admin/works`;
    console.log('Request URL:', reqUrl);

    return this.http.get<PagedResponse<WorkOption[]>>(reqUrl, { headers }).pipe(
      map((response) => {
        this.fetchWorkData = response.data;
        console.log('Fetch Work Data:', this.fetchWorkData);
        return this.fetchWorkData;
      }),
      catchError((error) => {
        console.error('Error fetching work options:', error);
        this.fetchWorkData = [];
        return of(this.fetchWorkData);
      })
    );
  }
}
