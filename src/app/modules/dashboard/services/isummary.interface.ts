import { Observable } from "rxjs";
import { PagedResponse } from "../../../core/models/api.model";
import {
  Timesheet,
  TimesheetSummary,
} from "../../approval/model/timesheet.model";

export interface ISummaryService {
  getSummary(): Observable<PagedResponse<TimesheetSummary[]>>;
  getMonthReport(): Observable<PagedResponse<Timesheet[]>>;
//   getSummaryTrend(): Observable<PagedResponse<Timesheet[]>>;
}
