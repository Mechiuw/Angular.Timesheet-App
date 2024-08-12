import { Observable } from 'rxjs';
import {Timesheet, TimesheetResponse, WorkOption} from '../model/timesheet';
import {FormGroup} from "@angular/forms";

export interface ITimesheetService {
  GetTimesheet(): Observable<Timesheet[]>;
  GetTimesheetById(id: any): Observable<TimesheetResponse>;
  SaveTimesheet(timesheet: Timesheet): Observable<void>;
  UpdateTimesheet(id: any, timesheet: Timesheet): Observable<any>;
  DeleteTimesheet(id: number): Observable<void>;
  SubmitTimesheet(id: any): Observable<any>;
  FetchWorkOptions(): Observable<WorkOption[]>;
  ValidateTime(overtimeForm: FormGroup): boolean;

  CalculateTotal(
    overtimeForm: FormGroup,
    workOptions$: Observable<WorkOption[]>
  ): void;
}
