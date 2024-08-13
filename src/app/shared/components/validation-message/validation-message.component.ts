import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  VALIDATION_MESSAGE,
  formatValidationMessage,
} from '../../../modules/timesheet/utils/validator';

@Component({
  selector: 'app-validation-message',
  standalone: true,
  imports: [],
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.scss',
})
export class ValidationMessageComponent {
  @Input() control: AbstractControl | null = null;
  @Input() label!: string;

  private validationMessage = VALIDATION_MESSAGE;

  get errorMessages(): string[] {
    if (this.control && this.control.errors) {
      return Object.keys(this.control.errors).map((key) => {
        const params = this.control?.errors![key];
        return formatValidationMessage(
          this.validationMessage[key],
          this.label,
          ...Object.values(params)
        );
      });
    }
    return [];
  }
}
