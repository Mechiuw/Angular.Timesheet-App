import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime, Timesheet, Status } from '../../model/timesheet';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.scss',
})
export class SubmitButtonComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  timesheet: Timesheet = {} as Timesheet;
  timesheetDetails: Overtime[] = [];

  constructor(
    private readonly overtimeService: OvertimeService,
    private readonly timesheetService: TimesheetService
  ) {}
  ngOnInit(): void {
    this.overtimeService.List().subscribe((data) => {
      this.timesheetDetails = data;
    });
  }

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

      // console.log('Timesheet detail: ', timesheet);
      this.formSubmitted.emit();
      this.overtimeService.clearWorks();
    }
  }
}
