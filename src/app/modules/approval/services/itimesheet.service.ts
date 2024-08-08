import { Observable } from 'rxjs';
import { Timesheet } from '../model/timesheet.model';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';

export interface ITimesheetService {
  getAllTimesheet(params?: string): Observable<PagedResponse<Timesheet[]>>;
  getAllTimesheetByAuth(role?: string, route?: string): Observable<PagedResponse<Timesheet[]>>;
  getTimesheetById(id: string): Observable<SingleResponse<Timesheet>>;
  acceptTimesheetByManager(id: string): Observable<SingleResponse<string>>;
  denyTimesheetByManager(id: string): Observable<SingleResponse<string>>;
  approveTimesheetByBenefit(id: string): Observable<SingleResponse<string>>;
  rejectTimesheetByBenefit(id: string): Observable<SingleResponse<string>>;
}
