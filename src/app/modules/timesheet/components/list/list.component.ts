import { Component } from '@angular/core';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime } from '../../model/timesheet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  constructor(private readonly OvertimeService: OvertimeService) {}

  overtimeForm: Overtime[] = [];
  totalPay: number = 0;
  date: Date = new Date();

  ngOnInit() {
    this.OvertimeService.List().subscribe((data) => {
      this.overtimeForm = data;
      this.totalPay = this.OvertimeService.totalPay;

      console.log(this.overtimeForm);
    });
  }

  remove(id: any) {
    this.OvertimeService.Delete(id).subscribe(() => {
      this.ngOnInit();
    });
  }
}
