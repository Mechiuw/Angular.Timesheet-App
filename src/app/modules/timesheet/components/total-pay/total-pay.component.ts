import { Component, Input, OnInit } from '@angular/core';
import { OvertimeService } from '../../services/overtime.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-pay.component.html',
  styleUrls: ['./total-pay.component.scss'],
})
export class TotalPayComponent {
  @Input() totalPay: number = 0;
}
