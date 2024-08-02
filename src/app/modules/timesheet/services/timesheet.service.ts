import { Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { Observable } from 'rxjs';
import { Status, Timesheet } from '../model/timesheet';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
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

  private readonly descriptionOptions: {
    id: number;
    desc: string;
    fee: number;
  }[] = [
    { id: 1, desc: 'Interview Kandidat Bootcamp', fee: 30000 },
    { id: 2, desc: 'InstructorLed Basic', fee: 50000 },
    { id: 3, desc: 'InstructorLed Intermediate', fee: 50000 },
    { id: 4, desc: 'Overtime Kelas Karyawan', fee: 50000 },
    { id: 5, desc: 'Other', fee: 50000 },
  ];

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
    throw new Error('Method not implemented.');
  }
  UpdateTimesheet(timesheet: Timesheet): Observable<void> {
    throw new Error('Method not implemented.');
  }
  DeleteTimesheet(id: number): Observable<void> {
    throw new Error('Method not implemented.');
  }

  GetWorkOptions(): { id: number; desc: string; fee: number }[] {
    return this.descriptionOptions;
  }
}
