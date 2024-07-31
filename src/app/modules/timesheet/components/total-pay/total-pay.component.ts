import { Component, OnInit } from '@angular/core';
import { OvertimeService } from '../../services/overtime.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-pay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-pay.component.html',
  styleUrls: ['./total-pay.component.scss'],
})
export class TotalPayComponent implements OnInit {
  totalPay: number = 0;

  constructor(private overtimeService: OvertimeService) {}

  ngOnInit() {
    this.overtimeService.getTotalPay().subscribe((total) => {
      this.totalPay = total;
    });
  }

  load() {
    this.ngOnInit();
  }
}
