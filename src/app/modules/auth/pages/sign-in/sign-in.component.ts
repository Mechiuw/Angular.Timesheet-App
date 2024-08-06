import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent, ToastModule],
  providers: [MessageService]

})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  constructor(
    private readonly formBuilder: FormBuilder, 
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  // onClick() {
  //   alert('Button clicked');
  // }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.authService.login({ email, password }).subscribe({
      next: () => {
        console.log(this.authService.currentUser);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // console.log(err.error.responseMessage);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warn',
          detail: err.error.data,
        })
      },
    });

    // this.authService.loginDummy().subscribe((token) => {
    //   console.log("SignIn.loginDummy : "+token);
    //   console.log("SignIn.currentUser : "+ this.authService.currentUser?.email);
    //   // this.router.navigate(['/dashboard']);
    // });
  }
}
