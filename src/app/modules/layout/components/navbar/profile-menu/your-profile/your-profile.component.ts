import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-your-profile',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './your-profile.component.html',
  styleUrl: './your-profile.component.scss',
})
export class YourProfileComponent {
  name: string = 'Johnny Storm';
  username: string = 'johnny123';
  email: string = 'johnny@email.com';
  editMode: boolean = false;
  loading: boolean = false;

  constructor(private location: Location) {}

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
    this.name = newName;
    this.username = newUsername;
    this.email = newEmail;
    this.load();
  }
}
