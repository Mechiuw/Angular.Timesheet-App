import { inject, Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { catchError, map, Observable, of } from 'rxjs';
import { Status, Timesheet, WorkOption } from '../model/timesheet';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
          workID: 3,
        },
        {
          date: new Date('2024-07-05T17:00:00.000Z'),
          startTime: new Date('2024-07-06T02:00:00.000Z'),
          endTime: new Date('2024-07-06T03:00:00.000Z'),
          workID: 2,
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
          workID: 3,
        },
        {
          id: 1722585968767,
          date: new Date('2024-07-09T17:00:00.000Z'),
          startTime: new Date('2024-07-10T03:00:00.000Z'),
          endTime: new Date('2024-07-10T05:00:00.000Z'),
          workID: 1,
        },
        {
          id: 1722585934135,
          date: new Date('2024-07-10T17:00:00.000Z'),
          startTime: new Date('2024-07-11T03:00:00.000Z'),
          endTime: new Date('2024-07-11T05:00:00.000Z'),
          workID: 1,
        },
      ],
      status: Status.OnProgress,
    },
    {
      id: 3,
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
          workID: 3,
        },
        {
          id: 1722585968767,
          date: new Date('2024-07-09T17:00:00.000Z'),
          startTime: new Date('2024-07-10T03:00:00.000Z'),
          endTime: new Date('2024-07-10T05:00:00.000Z'),
          workID: 1,
        },
        {
          id: 1722585934135,
          date: new Date('2024-07-10T17:00:00.000Z'),
          startTime: new Date('2024-07-11T03:00:00.000Z'),
          endTime: new Date('2024-07-11T05:00:00.000Z'),
          workID: 1,
        },
      ],
      status: Status.Approved,
    },
    {
      id: 4,
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
          workID: 3,
        },
        {
          id: 1722585968767,
          date: new Date('2024-07-09T17:00:00.000Z'),
          startTime: new Date('2024-07-10T03:00:00.000Z'),
          endTime: new Date('2024-07-10T05:00:00.000Z'),
          workID: 1,
        },
        {
          id: 1722585934135,
          date: new Date('2024-07-10T17:00:00.000Z'),
          startTime: new Date('2024-07-11T03:00:00.000Z'),
          endTime: new Date('2024-07-11T05:00:00.000Z'),
          workID: 1,
        },
      ],
      status: Status.Rejected,
    },
  ];

  private readonly descriptionOptions: WorkOption[] = [
    { id: 1, desceription: 'Interview Kandidat Bootcamp', fee: 30000 },
    { id: 2, desceription: 'InstructorLed Basic', fee: 50000 },
    { id: 3, desceription: 'InstructorLed Intermediate', fee: 50000 },
    { id: 4, desceription: 'Overtime Kelas Karyawan', fee: 50000 },
    { id: 5, desceription: 'Other', fee: 50000 },
  ];

  private apiUrl = 'https://sure-pika-easy.ngrok-free.app';

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
    return this.descriptionOptions;
  }

  testFetch(): Observable<any> {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjU0NTUxODAsImlhdCI6MTcyMjg2MzE4MCwiaXNzIjoidGltZXNoZWV0LWFwcCIsImlkIjoiYjZhZmY4ODUtZWM0My00YmU5LWJiZDItOTI5OWUxMDE4ZTNiIiwidXNlcm5hbWUiOiJlcGMiLCJlbWFpbCI6ImVwYzQxODA1QHpjY2NrLmNvbSIsInJvbGUiOiJ1c2VyIn0.LCuDVFKvKlkoT3npEHuxnt-05kc6FhI62X-l1S4zGNA';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const reqUrl = `${this.apiUrl}/admin/work`;
    console.log('Request URL:', reqUrl);

    return this.http.get<any>(reqUrl, { headers }).pipe(
      map((response) => {
        console.log('Response:', response); // Log response for debugging
        return response;
      }),
      catchError((error) => {
        console.error('Error fetching work options:', error);
        return of(this.descriptionOptions); // Return dummy data in case of error
      })
    );
  }
}
