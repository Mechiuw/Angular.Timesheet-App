import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProfileService } from '../../../../services/profile.service';
import { ProfileResponse } from '../../../../models/profile.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
  ],
  templateUrl: './your-profile.component.html',
  styleUrl: './your-profile.component.scss',
})
export class YourProfileComponent implements OnInit {
  profile: ProfileResponse['data'] | null = null;
  errorMessage: string | null = null;
  successMessage: string = '';
  selectedFile: File | null = null;
  editMode: boolean = false;
  loading: boolean = false;
  showForm: boolean = false;

  constructor(
    private location: Location,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showForm = true;
      this.fetchProfile();
    }, 1000);
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
      this.profileService.uploadSignature(this.selectedFile).subscribe({
        next: (response) => {
          if (response.status.code === 200) {
            this.successMessage = 'File uploaded successfully';
            this.fetchProfile();
          } else {
            this.errorMessage = `Error: ${response.data}`;
          }
        },
        error: (error) => {
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
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
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

  saveName(newName: string, newUsername: string, newEmail: string): void {
    // this.name = newName;
    // this.username = newUsername;
    // this.email = newEmail;
    this.load();
  }
}
