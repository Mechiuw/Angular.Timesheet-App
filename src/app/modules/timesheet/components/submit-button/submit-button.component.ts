import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime, Timesheet, Status } from '../../model/timesheet';
import Swal from 'sweetalert2';

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
      Swal.fire({
        icon: 'error',
        text: 'Please add overtime first!',
      });
      return;
    }

    Swal.fire({
      title: 'Submit?',
      icon: 'question',
      text: 'Are you sure you want to submit?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit!',
    }).then((result) => {
      if (result.isConfirmed) {
        const timesheet: Timesheet = {
          userId: 1,
          createdAt: new Date(Date.now()),
          confirmedManagerBy: 'ManagerName',
          confirmedBenefitBy: 'BenefitName',
          works: this.timesheetDetails.map(
            ({ total, ...overtime }) => overtime
          ),
          status: Status.Pending,
        };

        // console.log('Timesheet detail: ', timesheet);
        this.formSubmitted.emit();
        this.overtimeService.clearWorks();

        Swal.fire({
          title: 'Success!',
          text: 'Your form has been submitted.',
          icon: 'success',
        });
      }
    });
  }
}
