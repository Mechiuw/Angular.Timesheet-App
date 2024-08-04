import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [NgIf],
  templateUrl: './activation.component.html',

  styleUrl: './activation.component.scss'
})
export class ActivationComponent implements OnInit {
  token$ = new BehaviorSubject<string>('');
  isActived = false;
  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    // this.token = this.activatedRoute.snapshot.params['t'] || '';
    this.token$.next(this.activatedRoute.snapshot.queryParams['t'] || '');
    this.onActivate();
  }
  
  onActivate() {
    // console.log(this.token$.value);
    this.authService.activate(this.token$.value).subscribe({
      next: () => {
        // console.log(this.authService.currentUser);
        // this.router.navigate(['/dashboard']);
        this.isActived = true;
      },
      error: (err) => {
        console.log(err.error.responseMessage);
      },
    });
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
