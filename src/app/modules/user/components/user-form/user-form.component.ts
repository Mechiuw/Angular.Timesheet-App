import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, FloatLabelModule, InputTextModule, DropdownModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent, ToastModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  providers: [MessageService]
  
})
export class UserFormComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  cities: { name: string, code: string }[] | undefined;

  constructor(
    private readonly formBuilder: FormBuilder, 
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  // onClick() {
  //   alert('Button clicked');
  // }

  ngOnInit(): void {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
  ];

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      // role: ['', Validators.required],
      role: new FormControl<{ name: string, code: string } | null>(null)

    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const { email, password } = this.form.value;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // this.authService.login({ email, password }).subscribe({
    //   next: () => {
    //     // console.log(this.authService.currentUser);
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (err) => {
    //     // console.log(err.error.responseMessage);
    //     this.messageService.add({
    //       severity: 'warn',
    //       summary: 'Warn',
    //       detail: err.error.responseMessage,
    //     })
    //   },
    // });

    // this.authService.loginDummy().subscribe((token) => {
    //   console.log("SignIn.loginDummy : "+token);
    //   console.log("SignIn.currentUser : "+ this.authService.currentUser?.email);
    //   // this.router.navigate(['/dashboard']);
    // });
  }
}
