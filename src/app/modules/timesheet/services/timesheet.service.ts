import { Injectable } from '@angular/core';
import { ITimesheetService } from './itimesheet.service';
import { Observable } from 'rxjs';
import { Timesheet } from '../model/timesheet';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
  GetTimesheet(): Observable<Timesheet[]> {
    throw new Error('Method not implemented.');
  }
  GetTimsheetById(id: number): Observable<Timesheet> {
    throw new Error('Method not implemented.');
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
}
