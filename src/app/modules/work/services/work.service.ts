import { Injectable } from '@angular/core';
import { IWorkService } from './iwork.interface';
import { Observable } from 'rxjs';
import { PagedResponse, SingleResponse } from '../../../core/models/api.model';
import { Work } from '../models/work.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class WorkService implements IWorkService {

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) { }
  
  List(): Observable<PagedResponse<Work[]>> {
    return this.http.get<PagedResponse<Work[]>>(API_ENDPOINT.WORK);
  }
  Get(id: number): Observable<SingleResponse<Work>> {
    return this.http.get<SingleResponse<Work>>(`${API_ENDPOINT.WORK}/${id}`);
  }
  Add(work: Work): Observable<SingleResponse<Work>> {
    return this.http.post<SingleResponse<Work>>(API_ENDPOINT.WORK, work);
  }
  Update(work: Work): Observable<SingleResponse<Work>> {
    return this.http.put<SingleResponse<Work>>(`${API_ENDPOINT.WORK}/${work.id}`, work);
  }
  Delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINT.WORK}/${id}`);
  }
  
}
