import { Injectable } from '@angular/core';
import { IWorkService } from './iwork.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';
import { Work } from '../models/work.model';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class WorkService implements IWorkService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  private workSubject = new BehaviorSubject<Work[]>([]);
  works$: Observable<Work[]> = this.workSubject.asObservable(); // Observable for other components subscribe


  List(rows: number = 10, page: number = 1): Observable<PagedResponse<Work[]>> {
    try {
      return this.http.get<PagedResponse<Work[]>>(`${API_ENDPOINT.WORK}?paging=${page}&rowsPerPage=${rows}`)
    } catch (error: any) {
      return error.message;
    }
  }
  Get(id: string): Observable<SingleResponse<Work>> {
    return this.http.get<SingleResponse<Work>>(`${API_ENDPOINT.WORK}/${id}`);
  }
  Add(work: Work): Observable<SingleResponse<Work>> {
    try {
      return this.http.post<SingleResponse<Work>>(`${API_ENDPOINT.WORK}/`, work);
    } catch (error: any) {
      return error.message;
    }
  }
  Update(work: Work): Observable<SingleResponse<Work>> {
    return this.http.put<SingleResponse<Work>>(`${API_ENDPOINT.WORK}/${work.id}`, work);
  }
  Delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINT.WORK}/${id}`);
  }
  GetByName(name: string): Observable<PagedResponse<Work[]>> {
    try {
      return this.http.get<PagedResponse<Work[]>>(`${API_ENDPOINT.WORK}?description=${name}`)
    } catch (error: any) {
      return error.message;
    }
  }

   // Update data
   updateWorks(): void {
    this.List().subscribe(works => {
      this.workSubject.next(works.data);
    });
  }

}
