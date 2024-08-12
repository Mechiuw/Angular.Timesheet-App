import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Timesheet, TimesheetResponse, WorkOption } from '../model/timesheet';
import { HttpClient } from '@angular/common/http';
import { PagedResponse } from '../../../core/models/api.model';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { SessionService } from '../../../core/services/session.service';
import { jwtDecode } from 'jwt-decode';
import { ITimesheetService } from './itimesheet.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
  private readonly http = inject(HttpClient);
  private session = inject(SessionService);

  private isLoading$ = new BehaviorSubject<boolean>(false);

  private fetchWorkData: WorkOption[] = [];
  private fetchTimesheetData: Timesheet[] = [];
  private fetchTimesheetDataID: TimesheetResponse = {} as TimesheetResponse;

  private apiUrl = API_ENDPOINT.TIMESHEET;
  private readonly token = this.session.get('token');

  private date: Date = new Date();

  get isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  GetTimesheet(): Observable<Timesheet[]> {
    const monthPrev = this.date.getMonth();
    const monthNow = this.date.getMonth() + 1;
    const decodedToken: any = jwtDecode(this.token!);

    const reqUrl = `${API_ENDPOINT.TIMESHEET}?period=${monthPrev}:${monthNow}&userId=${decodedToken.id}&status=created`;
    return this.http.get<{ data: Timesheet[] }>(reqUrl).pipe(
      map((response) => {
        this.fetchTimesheetData = response.data;

        return this.fetchTimesheetData;
      }),
      catchError(() => {
        this.fetchTimesheetData = [];
        return of(this.fetchTimesheetData);
      })
    );
  }

  GetTimesheetById(id: any): Observable<TimesheetResponse> {
    const reqUrl = `${this.apiUrl}/${id}`;

    return this.http.get<{ data: TimesheetResponse }>(reqUrl).pipe(
      map((response) => {
        this.fetchTimesheetDataID = {
          ...response.data,
        };
        return this.fetchTimesheetDataID;
      }),
      catchError((err) => {
        return throwError(() => err.error.data);
      })
    );
  }

  SaveTimesheet(timesheet: Timesheet): Observable<any> {
    const reqUrl = `${this.apiUrl}/`;

    return this.http.post(reqUrl, timesheet).pipe(
      tap(() => {}),
      catchError((error) => {
        return throwError(() => error.error.data);
      })
    );
  }

  UpdateTimesheet(id: any, timesheet: Timesheet): Observable<any> {
    const reqUrl = `${this.apiUrl}/${id}`;

    return this.http.put(reqUrl, timesheet).pipe(
      tap(() => {}),
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }

  DeleteTimesheet(id: any): Observable<any> {
    const reqUrl = `${this.apiUrl}/${id}`;

    return this.http.delete(reqUrl).pipe(
      tap(() => {}),
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }

  SubmitTimesheet(id: any): Observable<any> {
    const reqUrl = `${this.apiUrl}/${id}/submit`;

    return this.http.put(reqUrl, {}).pipe(
      tap(() => {}),
      catchError((error) => {
        return throwError(() => new Error(error));
      })
    );
  }

  FetchWorkOptions(): Observable<WorkOption[]> {
    return this.http.get<PagedResponse<WorkOption[]>>(API_ENDPOINT.WORK).pipe(
      map((response) => {
        this.fetchWorkData = response.data;
        return this.fetchWorkData;
      }),
      catchError(() => {
        this.fetchWorkData = [];
        return of(this.fetchWorkData);
      })
    );
  }

  ValidateTime(overtimeForm: FormGroup): boolean {
    const startTime = new Date(overtimeForm.get('startTime')?.value);
    const endTime = new Date(overtimeForm.get('endTime')?.value);

    const diff = (endTime.getTime() - startTime.getTime()) / (60 * 60 * 1000);
    const checkMultiply = (diff % 1) == 0

    return !(checkMultiply && (diff < 1));
  }

  CalculateTotal(
    overtimeForm: FormGroup,
    workOptions$: Observable<WorkOption[]>
  ): void {
    const startTime = new Date(overtimeForm.get('startTime')?.value);
    const endTime = new Date(overtimeForm.get('endTime')?.value);
    const workID = overtimeForm.get('workID')?.value?.id;

    if (startTime && endTime && workID) {
      workOptions$
        .pipe(
          map((options: WorkOption[]) =>
            options.find((option) => option.id === workID)
          ),
          switchMap((work) => {
            if (!work) {
              return of(0);
            }

            const fee = work.fee;

            if (startTime > endTime) {
              return of(0);
            }

            const overtimeHours = endTime.getHours() - startTime.getHours();

            if (
              overtimeHours >= 2 &&
              work.description.toLowerCase().startsWith('interview')
            ) {
              return of(overtimeHours * 50000);
            }

            return of(overtimeHours * fee);
          })
        )
        .subscribe((total) => {
          overtimeForm.get('total')?.setValue(total, { emitEvent: false });
        });
    }
  }
}
