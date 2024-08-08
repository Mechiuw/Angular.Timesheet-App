import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProfileService } from '../../../../services/profile.service';
import {
  ChangePasswordRequest,
  ProfileRequest,
  ProfileResponse,
} from '../../../../models/profile.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-your-profile',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    FileUploadModule,
    ToastModule,
  ],
  templateUrl: './your-profile.component.html',
  styleUrl: './your-profile.component.scss',
  providers: [MessageService],
})
export class YourProfileComponent implements OnInit {
  profile: ProfileResponse['data'] | null = null;
  newPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string = '';
  selectedFile: File | null = null;
  editMode: boolean = false;
  loading: boolean = false;
  loadingUpload: boolean = false;
  showForm: boolean = false;
  uploadedFiles: any;
  changePasswordForm: boolean = false;

  constructor(
    private location: Location,
    private profileService: ProfileService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showForm = true;
      this.fetchProfile();
    }, 2000);
  }

  fetchProfile(): void {
    this.profileService.detailAccount().subscribe({
      next: (response) => {
        if (response.status.code === 200) {
          this.profile = response.data;
        } else {
          this.errorMessage = `Error: ${response.status.message}`;
        }
      },
      error: (error) => {
        this.errorMessage = `Error: ${
          error.message || 'An unknown error occurred'
        }`;
      },
    });
  }

  fetchUploadSignature(): void {
    if (this.selectedFile) {
      this.loadingUpload = true;
      this.profileService.uploadSignature(this.selectedFile).subscribe({
        next: (response) => {
          this.loadingUpload = false;
          if (response.status.code === 200) {
            this.successMessage = 'File uploaded successfully';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.successMessage,
            });
            this.fetchProfile();
          } else {
            this.errorMessage = `Error: ${response.status.message}`;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.errorMessage,
            });
          }
        },
        error: (error) => {
          this.loadingUpload = false;
          this.errorMessage = `Error: ${
            error.message || 'An unknown error occurred'
          }`;
        },
      });
    } else {
      this.errorMessage = 'Please select a file to upload';
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.fetchUploadSignature();
    }
  }

  saveProfile(): void {
    if (this.profile) {
      const payload: ProfileRequest = {
        email: this.profile.email,
        name: this.profile.name,
        phone: this.profile.phone,
      };
      console.log('Payload: ', payload);
      this.loading = true;
      this.profileService.updateProfile(payload).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.status.code === 200) {
            this.successMessage = 'Profile updated successfully';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.successMessage,
            });
            this.editMode = false;
            this.fetchProfile();
          } else {
            this.errorMessage = `Error: ${response.status.message}`;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.errorMessage,
            });
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = `Error: ${
            error.message || 'An unknown error occurred'
          }`;
        },
      });
    } else {
      this.errorMessage = 'Profile data is not available';
    }
  }

  toggleChangePassword(): void {
    this.changePasswordForm = true;
  }

  fetchChangePassword(): void {
    const payload: ChangePasswordRequest = {
      newPassword: this.newPassword,
    };
    console.log('Payload: ', payload);
    this.loadingUpload = true;
    this.profileService.changePassword(payload).subscribe({
      next: (response) => {
        this.loadingUpload = false;
        if (response.status.code === 200) {
          this.successMessage = 'Password changed successfully';
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: this.successMessage,
          });
          this.changePasswordForm = false;
        }
        else if (this.newPassword === '') {
          this.errorMessage = 'Password cannot be empty';
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail: this.errorMessage,
          });
          this.loadingUpload = false;
        } else {
          this.errorMessage = `Error: ${response.status.message}`;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.errorMessage,
          });
        }
      },
      error: (error) => {
        this.loadingUpload = false;
        this.errorMessage = `Error: ${
          error.message || 'An unknown error occurred'
        }`;
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.editMode = false;
    }, 2000);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
}
