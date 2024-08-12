import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import {
  ChangePasswordRequest,
  ProfileRequest,
  ProfileResponse,
} from '../models/profile.model';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionService: SessionService
  ) {}

  detailAccount(): Observable<ProfileResponse> {
    return this.http
      .get<ProfileResponse>(API_ENDPOINT.AUTH.DETAIL_PROFILE)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error:', error);
          return of({
            status: { code: 500, message: 'Internal Server Error' },
            data: null,
          } as unknown as ProfileResponse);
        })
      );
  }

  uploadSignature(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    return this.http
      .post<any>(API_ENDPOINT.AUTH.UPLOAD_SIGNATURE, formData)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error:', error);
          return of({
            status: { code: 500, message: 'Internal Server Error' },
            data: null,
          });
        })
      );
  }

  updateProfile(payload: ProfileRequest): Observable<any> {
    return this.http
      .put<ProfileRequest>(API_ENDPOINT.AUTH.UPDATE_ACCOUNTS, payload)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error:', error);
          return of({
            status: { code: 500, message: 'Internal Server Error' },
            data: null,
          });
        })
      );
  }

  changePassword(payload: ChangePasswordRequest): Observable<any> {
    return this.http
      .put<ProfileRequest>(API_ENDPOINT.AUTH.CHANGE_PASSWORD, payload)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => {
          console.error('Error:', error);
          return of({
            status: { code: 500, message: 'Internal Server Error' },
            data: null,
          });
        })
      );
  }
}
