import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from '../../core/services/sesssion.service';
import { UserInfo } from '../../core/models/user-info.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  selector: 'app-approval',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss',
})
export class ApprovalComponent implements OnInit {
  // Data user from session
  private currentUser$: BehaviorSubject<UserInfo | null>;

  // Data Params
  currentUser: UserInfo | null = null;

  // Service Login Dummy (must be deleted when marge request)
  constructor(private readonly sessionService: SessionService) {
    this.currentUser$ = new BehaviorSubject<UserInfo | null>(
      sessionService.getCurrentUser()
    );
  }

  // Login Dummy (must be deleted when marge request)
  loginDummy(): Observable<string> {
    // list token to check auth
    const tokenManager =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNVQk9XTyIsImlhdCI6MTUxNjIzOTAyMiwiaWQiOiI2NTUzNiIsImVtYWlsIjoic3Vib3dAbWFpbC5jb20iLCJyb2xlIjoibWFuYWdlciJ9.av882-W5pOPAWqPFiLLbboXhHvDyfhFKUsJ7GhkI-go';
    const tokenBenefit =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNVQk9XTyIsImlhdCI6MTUxNjIzOTAyMiwiaWQiOiI2NTUzNiIsImVtYWlsIjoic3Vib3dAbWFpbC5jb20iLCJyb2xlIjoiYmVuZWZpdCJ9.UJad7bfJCQLTVThqklG0Y_pxPvh8pa3yOcfVzjfjzsc';
    const tokenAdmin =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNVQk9XTyIsImlhdCI6MTUxNjIzOTAyMiwiaWQiOiI2NTUzNiIsImVtYWlsIjoic3Vib3dAbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifQ.vGuaQ8GcwxIPh_MfvcR5e1kGce3sjQ7DUGVKIgIkwuA';
    
      // change token to check auth
    const token = tokenBenefit;

    this.sessionService.set('token', tokenAdmin);
    this.currentUser$.next(this.sessionService.getCurrentUser());
    return of(token);
  }

  ngOnInit(): void {
    // Login Dummy (must be deleted when marge request)
    this.loginDummy().subscribe((token) => {
      console.log(token);
    });
  }
}
