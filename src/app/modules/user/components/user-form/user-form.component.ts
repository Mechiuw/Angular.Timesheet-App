import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { RoleService } from '../../../role/service/role.service';
import { Role } from '../../../role/models/role.model';
import { UserService } from '../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { ValidationMessageComponent } from "../../../../shared/components/validation-message/validation-message.component";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    RouterLink,
    AngularSvgIconModule,
    NgClass,
    NgIf,
    ButtonComponent,
    ToastModule,
    ButtonModule,
    ValidationMessageComponent
],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  providers: [MessageService],
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;
  roles: Role[] = [];
  isLoadingSave: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly roleService: RoleService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      role: new FormControl<Role | null>(null, Validators.required),
    });

    this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles',
        });
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.isLoadingSave = true;

    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const { email, name, role } = this.form.value;

    const user = {
      email: email,
      name: name,
      roleId: role.id,
    };

    this.userService.registerUser(user).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User saved Successfully',
        });

        // Disable loading
        this.isLoadingSave = false;

        // Data load
        this.userService.updateUsers();

        // Reset form
        this.submitted = false;
        this.form.reset();
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.data || 'An error occured',
        });

        // Disable loading
        this.isLoadingSave = false;
      },
    });
  }

  isFormValid(field: string): boolean {
    const control: AbstractControl = this.form.get(
      field
    ) as AbstractControl;
    return control && control.invalid && (control.dirty || control.touched);
  }
}
