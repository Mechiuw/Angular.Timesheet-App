import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../../core/constants/api-endpoint';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [RouterLink, ButtonComponent, ReactiveFormsModule, CommonModule],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword: FormGroup;

  constructor() {
    this.forgotPassword = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private readonly http = inject(HttpClient);

  ngOnInit(): void {}

  onSubmit() {
    if (this.forgotPassword.valid) {
      const reqUrl = `${API_BASE_URL}/accounts/forget-password`;
      // console.log('Form Submitted', this.forgotPassword.value);
      // console.log({ reqUrl });

      this.http
        .post(reqUrl, { email: this.forgotPassword.value.email })
        .pipe(
          tap((response) => {
            // console.log('Form Submitted:', response);
          }),
          catchError((error) => {
            // console.error('Error:', error);

            return throwError(error);
          })
        )
        .subscribe();
    } else {
      // console.log('Form is invalid');
    }
  }
}
