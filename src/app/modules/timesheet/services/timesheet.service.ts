import { inject, Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Status, Timesheet, WorkOption } from '../model/timesheet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PagedResponse } from '../../../core/models/api.model';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
  private readonly http = inject(HttpClient);

  private dummyData: Timesheet[] = [
    {
      id: 1,
      userId: 1,
      createdAt: new Date('2024-07-03T17:00:00.000Z'),
      confirmedManagerBy: 'ManagerName',
      confirmedBenefitBy: 'BenefitName',
      works: [
        {
          date: new Date('2024-07-03T17:00:00.000Z'),
          startTime: new Date('2024-07-04T02:00:00.000Z'),
          endTime: new Date('2024-07-04T05:00:00.000Z'),
          workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
        },
        {
          date: new Date('2024-07-05T17:00:00.000Z'),
          startTime: new Date('2024-07-06T02:00:00.000Z'),
          endTime: new Date('2024-07-06T03:00:00.000Z'),
          workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
        },
      ],
      status: Status.Pending,
    },
    {
      id: 2,
      userId: 2,
      createdAt: new Date('2024-08-02T08:06:19.799Z'),
      confirmedManagerBy: 'ManagerName',
      confirmedBenefitBy: 'BenefitName',
      works: [
        {
          id: 1722585911431,
          date: new Date('2024-07-08T17:00:00.000Z'),
          startTime: new Date('2024-07-09T02:00:00.000Z'),
          endTime: new Date('2024-07-09T03:00:00.000Z'),
          workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
        },
        {
          id: 1722585968767,
          date: new Date('2024-07-09T17:00:00.000Z'),
          startTime: new Date('2024-07-10T03:00:00.000Z'),
          endTime: new Date('2024-07-10T05:00:00.000Z'),
          workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
        },
        {
          id: 1722585934135,
          date: new Date('2024-07-10T17:00:00.000Z'),
          startTime: new Date('2024-07-11T03:00:00.000Z'),
          endTime: new Date('2024-07-11T05:00:00.000Z'),
          workID: 'ab88eadb-3f49-47cb-9dbe-6a0bc92784ba',
        },
      ],
      status: Status.OnProgress,
    },
  ];

  // private readonly descriptionOptions: WorkOption[] = [
  //   { id: 1, description: 'Interview Kandidat Bootcamp', fee: 30000 },
  //   { id: 2, description: 'InstructorLed Basic', fee: 50000 },
  //   { id: 3, description: 'InstructorLed Intermediate', fee: 50000 },
  //   { id: 4, description: 'Overtime Kelas Karyawan', fee: 50000 },
  //   { id: 5, description: 'Other', fee: 50000 },
  // ];

  private fetchWorkData: WorkOption[] = [];
  private apiUrl = 'sure-pika-easy.ngrok-free.app';
  private readonly token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU0NzI1MDcsImlhdCI6MTcyMjg4MDUwNywiaXNzIjoidGltZXNoZWV0LWFwcCIsImlkIjoiYTM1NzU2MTYtNTg4Ni00YzRlLTkyYTgtNDJkMzQyN2QwZjZmIiwidXNlcm5hbWUiOiJBa3VuIEFkbWluIiwiZW1haWwiOiJhbHZpbmRvNTZAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIn0.rEeulS0-KoZOx9o-ASqLgNQ3cScEKrNEMMqkdiG_CFY';

  GetTimesheet(): Observable<Timesheet[]> {
    return new Observable<Timesheet[]>((observer) => {
      const timesheets = this.dummyData;
      if (timesheets) {
        observer.next(timesheets);
        observer.complete();
      } else {
        observer.error('Cant get timesheets');
      }
    });
  }

  GetTimsheetById(id: number): Observable<Timesheet> {
    return new Observable<Timesheet>((observer) => {
      setTimeout(() => {
        const timesheet = this.dummyData.find((t) => t.id === id);
        if (timesheet) {
          observer.next(timesheet);
          observer.complete();
        } else {
          observer.error('Timesheet not found');
        }
      }, 2000);
    });
  }

  SaveTimesheet(timesheet: Timesheet): Observable<void> {
    console.log('Save Timesheet: ' + JSON.stringify(timesheet));
    return new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
  }
  UpdateTimesheet(timesheet: Timesheet): Observable<void> {
    console.log('Update Timesheet: ' + JSON.stringify(timesheet));
    return new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
  }
  DeleteTimesheet(id: number): Observable<void> {
    throw new Error('Method not implemented.');
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
    // console.log('Request URL:', reqUrl);

    return this.http.get<PagedResponse<WorkOption[]>>(reqUrl, { headers }).pipe(
      map((response) => {
        this.fetchWorkData = response.data;
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
