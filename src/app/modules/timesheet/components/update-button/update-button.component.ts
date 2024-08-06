import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { Overtime, Status, Timesheet } from '../../model/timesheet';
import Swal from 'sweetalert2';
import { TimesheetService } from '../../services/timesheet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-button',
  standalone: true,
  imports: [],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.scss',
})
export class UpdateButtonComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  ngOnInit(): void {
    this.update.List().subscribe((data) => {
      this.timesheetDetails = data;
    });
  }

  private readonly update: OvertimeUpdateService = inject(
    OvertimeUpdateService
  );
  private readonly timesheetService = inject(TimesheetService);
  private router = inject(Router);

  timesheet: Timesheet = {} as Timesheet;
  timesheetDetails: Overtime[] = [];

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
          timeSheetDetails: this.timesheetDetails.map(
            ({ total, ...overtime }) => overtime
          ),
        };

        this.timesheetService.UpdateTimesheet(timesheet);
        this.formSubmitted.emit();
        this.update.clearWorks();
        Swal.fire({
          title: 'Success!',
          text: 'Your form has been submitted.',
          icon: 'success',
        });
        this.router.navigate(['/timesheets/create']);
      }
    });
  }
}
