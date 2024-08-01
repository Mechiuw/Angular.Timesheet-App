import { Component } from '@angular/core';

@Component({
  selector: 'app-update-button',
  standalone: true,
  imports: [],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.scss',
})
export class UpdateButtonComponent {
  onclick() {
    return alert('update-button works!');
  }
}
