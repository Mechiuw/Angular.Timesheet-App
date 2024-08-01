import { Component, inject, OnInit } from '@angular/core';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { Overtime, Status, Timesheet } from '../../model/timesheet';

@Component({
  selector: 'app-update-button',
  standalone: true,
  imports: [],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.scss',
})
export class UpdateButtonComponent implements OnInit {
  ngOnInit(): void {
    this.update.List().subscribe((data) => {
      this.timesheetDetails = data;
    });
  }

  private readonly update: OvertimeUpdateService = inject(
    OvertimeUpdateService
  );

  timesheet: Timesheet = {} as Timesheet;
  timesheetDetails: Overtime[] = [];

  onclick() {
    if (this.timesheetDetails.length === 0) {
      return alert('Please fill out the timesheet form.');
    }

    const confirm = window.confirm('Are you sure you want to submit?');
    if (confirm) {
      const timesheet: Timesheet = {
        userId: 1,
        createdAt: new Date(Date.now()),
        confirmedManagerBy: 'ManagerName',
        confirmedBenefitBy: 'BenefitName',
        works: this.timesheetDetails.map(({ total, ...overtime }) => overtime),
        status: Status.Pending,
      };

      console.log('Timesheet detail: ', timesheet);
      this.update.clearWorks();
    }
  }
}
