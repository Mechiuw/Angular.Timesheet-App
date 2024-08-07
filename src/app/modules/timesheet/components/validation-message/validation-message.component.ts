import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  VALIDATION_MESSAGE,
  formatValidationMessage,
} from '../../utils/validator';

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
    // cek jika form input kedapatan sebuah error validation di ambil dari @Input control
    if (this.control && this.control.errors) {
      // kita ambil keys dari object {required: ...}
      return Object.keys(this.control.errors).map((key) => {
        // kemudian kita tampung keys nya kedalam params yang akan dikirim di function formatValidationMessage
        const params = this.control?.errors![key];
        // kirim message: key dari this.control.error & validation_message, kemudian label dari @Input, kemudian valuenya (pesan error nya apa)
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
