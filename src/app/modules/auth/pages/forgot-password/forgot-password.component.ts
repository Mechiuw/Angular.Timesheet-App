import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [RouterLink, ButtonComponent, ReactiveFormsModule, CommonModule],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword: FormGroup;
  sendEmail: number = 0;

  constructor() {
    this.forgotPassword = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.sendEmail = 0;
  }

  onSubmit() {
    if (this.forgotPassword.valid) {
      this.sendEmail += 1;

      const reqUrl = `${API_BASE_URL}/accounts/forget-password`;
      // console.log('Form Submitted', this.forgotPassword.value);
      // console.log({ reqUrl });

      if (this.sendEmail >= 5) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You have limiting forgot password request',
        });
        return;
      }

      this.http
        .post(
          reqUrl,
          { email: this.forgotPassword.value.email },
          {
            headers: {
              Authorization: 'Basic dGltZXNoZWV0LWFwcDplbmlnbWEtY2FtcA==',
            },
          }
        )
        .pipe(
          tap((response) => {
            console.log('Form Submitted:', response);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Succes Send New Password to Your Email Address',
            });
            this.router.navigate(['/auth/sign-in']);
          }),
          catchError((error) => {
            console.error('Error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Email Unregistered',
            });
            return throwError(error);
          })
        )
        .subscribe();
    }
  }
}
