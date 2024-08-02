import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-your-profile',
  standalone: true,
  imports: [AngularSvgIconModule, CommonModule, FormsModule],
  templateUrl: './your-profile.component.html',
  styleUrl: './your-profile.component.scss'
})
export class YourProfileComponent {
  name: string = 'Johnny Storm';
  username: string = 'johnny123';
  email: string = 'johnny@email.com';
  editMode: boolean = false;

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveName(newName: string, newUsername: string, newEmail: string): void {
    this.name = newName;
    this.username = newUsername;
    this.email = newEmail;
    this.editMode = false;
  }
}
