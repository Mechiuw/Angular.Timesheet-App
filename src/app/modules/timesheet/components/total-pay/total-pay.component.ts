import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RupiahFormatPipe } from '../../../../shared/pipes/rupiah-format.pipe';

@Component({
  selector: 'app-total-pay',
  standalone: true,
  imports: [CommonModule, RupiahFormatPipe],
  templateUrl: './total-pay.component.html',
  styleUrls: ['./total-pay.component.scss'],
})
export class TotalPayComponent {
  @Input() totalPay: number = 0;
}
