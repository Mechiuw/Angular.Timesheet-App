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
import { AuthService } from '../../../auth/services/auth.service';
import { RoleService } from '../../../role/service/role.service';
import { Role } from '../../../role/models/role.model';


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
  roles : Role[] = [];

  constructor(
    private readonly formBuilder: FormBuilder, 
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly authService : AuthService,
    private readonly roleService : RoleService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password : ['',Validators.required],
      role: new FormControl<Role | null>(null, Validators.required),
    });

    this.roleService.getAllRoles().subscribe({
      next:(roles) => {
        this.roles = roles;
      },
      error:(error) => {
        this.messageService.add({
          severity:'error',
          summary:'Error',
          detail:'Failed to load roles'
        });
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.form.invalid) {
      return;
    }
    
    const { email, password } = this.form.value;
    this.authService.login({ email, password}).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Form submitted successfully.'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err:any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.responseMessage || 'An error occurred.'
        });
      }
    });

  }
}
