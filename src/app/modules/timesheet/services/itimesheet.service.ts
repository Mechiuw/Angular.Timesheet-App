import { Observable } from 'rxjs';
import { Timesheet } from '../model/timesheet';

export interface ITimesheetService {
  GetTimesheet(): Observable<Timesheet[]>;
  GetTimsheetById(id: number): Observable<Timesheet>;
  SaveTimesheet(timesheet: Timesheet): Observable<void>;
  UpdateTimesheet(timesheet: Timesheet): Observable<void>;
  DeleteTimesheet(id: number): Observable<void>;
}
