import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  API_BASE_URL,
} from '../../../core/constants/api-endpoint';
import { PagedResponse } from '../../../core/models/api.model';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}

  private userSubject = new BehaviorSubject<User[]>([]);
  users$: Observable<User[]> = this.userSubject.asObservable(); // Observable for other components subscribe

  getUsers(rows: number = 10, page: number = 1): Observable<PagedResponse<User[]>> {
    try {
      return this.http.get<PagedResponse<User[]>>(
        `${API_BASE_URL}/admin/accounts?paging=${page}&rowsPerPage=${rows}`
      );
    } catch (error: any) {
      return error.message;
    }
  }

  filterUsersByName(name: string) {
    try {
      return this.http.get<PagedResponse<User[]>>(
        `${API_BASE_URL}/admin/accounts?name=${name}`
      );
    } catch (error: any) {
      return error.message;
    }
  }

  registerUser(user: {
    email: string;
    name: string;
    roleId: string;
  }): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/admin/register`, user);
  }

  // Update data
  updateUsers(): void {
    this.getUsers().subscribe((users) => {
      this.userSubject.next(users.data);
    });
  }
}
