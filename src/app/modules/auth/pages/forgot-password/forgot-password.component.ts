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
import { catchError, tap } from 'rxjs';
import { API_BASE_URL } from '../../../../core/constants/api-endpoint';
import { MessageService } from 'primeng/api';
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword: FormGroup;
  sendEmail: number = 0;

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.forgotPassword = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.sendEmail = 0;
  }

  onSubmit() {
    if (this.forgotPassword.valid) {
      this.sendEmail += 1;

      const reqUrl = `${API_BASE_URL}/accounts/forget-password`;

      if (this.sendEmail >= 5) {
        this.messageService.add({
          severity: 'danger',
          summary: 'Danger',
          detail: 'forgot password request has exceeded the limit',
        });
        return;
      }

      this.http
        .post(reqUrl, { email: this.forgotPassword.value.email })
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Success Send New Password to Your Email Address',
            });
            this.router.navigate(['/auth/sign-in']);
          }),
          catchError((error) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Warn',
              detail: error.error.data,
            });
            return error;
          })
        )
        .subscribe();
    }
  }
}
