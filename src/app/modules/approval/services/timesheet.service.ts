import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { SessionService } from '../../../core/services/session.service';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';
import { Timesheet } from '../model/timesheet';
import { ITimesheetService } from './itimesheet.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService implements ITimesheetService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}
  getAllTimesheet(params: string): Observable<PagedResponse<Timesheet[]>> {
    try {
      return this.http.get<PagedResponse<Timesheet[]>>(
        API_ENDPOINT.TIMESHEET + '?rowsPerPage=1000' + params
      );
    } catch (error: any) {
      return error.message;
    }
  }
  getTimesheetById(id: string): Observable<SingleResponse<Timesheet>> {
    try {
      return this.http.get<SingleResponse<Timesheet>>(
        API_ENDPOINT.TIMESHEET + '/' + id
      );
    } catch (error: any) {
      return error.message;
    }
  }

  acceptTimesheetByManager(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.MANAGER.APPROVE + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
  denyTimesheetByManager(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.MANAGER.REJECT + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
  approveTimesheetByBenefit(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.BENEFIT.APPROVE + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
  rejectTimesheetByBenefit(id: string): Observable<SingleResponse<string>> {
    try {
      return this.http.post<SingleResponse<string>>(
        API_ENDPOINT.BENEFIT.REJECT + '/' + id,
        null
      );
    } catch (error: any) {
      return error.message;
    }
  }
}
