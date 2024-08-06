import { Observable } from 'rxjs';
import { Overtime } from '../model/timesheet';

export interface IOvertimeService {
  List(): Observable<Overtime[]>;
  Get(id: number): Observable<Overtime>;
  Save(overtime: Overtime): Observable<void>;
  Delete(id: number): Observable<void>;
}
