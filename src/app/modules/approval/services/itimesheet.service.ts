import { Observable } from 'rxjs';
import { Timesheet } from '../model/timesheet';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';

export interface ITimesheetService {
  getAllTimesheet(params ?: string): Observable<PagedResponse<Timesheet[]>>;
  getTimesheetById(id: string): Observable<SingleResponse<Timesheet>>;
}
