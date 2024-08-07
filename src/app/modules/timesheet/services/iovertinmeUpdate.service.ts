import { Observable } from 'rxjs';
import { Overtime } from '../model/timesheet';

export interface IOvertimeUpdateService {
  List(): Observable<Overtime[]>;
  GetWorks(works: Overtime[]): Observable<void>;
  Update(overtime: Overtime): Observable<void>;
  Delete(id: number): Observable<void>;
}
