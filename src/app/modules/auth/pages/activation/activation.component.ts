import { provideHttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [NgIf],
  templateUrl: './activation.component.html',

  styleUrl: './activation.component.scss'
})
export class ActivationComponent implements OnInit {
  token$ = new BehaviorSubject<string>('');
  constructor(
    private readonly authService: AuthService,
    private readonly _activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // this.token = this._activatedRoute.snapshot.params['t'] || '';
    this.token$.next(this._activatedRoute.snapshot.queryParams['t'] || '');
    this.onActivate();
  }
  
  onActivate() {
    console.log(this.token$.value);
    // this._authService.activate(this.token);
  }
}
