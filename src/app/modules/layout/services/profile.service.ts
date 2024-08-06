import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { API_ENDPOINT } from '../../../core/constants/api-endpoint';
import { ProfileRequest, ProfileResponse } from '../models/profile.model';
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
    const token = this.sessionService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ProfileResponse>(API_ENDPOINT.AUTH.DETAIL_PROFILE, { headers })
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
    const token = this.sessionService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    return this.http
      .post<any>(
        'https://api.yusharwz.my.id/api/v1/accounts/profile/upload-signature',
        formData,
        { headers }
      )
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
    const token = this.sessionService.get('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log("Token: ", token)
    console.log("Headers: ", headers)

    return this.http
      .put<ProfileRequest>('https://api.yusharwz.my.id/api/v1/accounts/', payload, { headers })
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
