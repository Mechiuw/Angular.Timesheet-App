import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime, Timesheet, Status } from '../../model/timesheet';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.overtimeService.List().subscribe((data) => {
      this.timesheetDetails = data;
    });
  }

  onclick() {
    this.ngOnInit();

    if (this.timesheetDetails.length === 0) {
      Swal.fire({
        icon: 'error',
        text: 'Please add overtime first!',
      });
      return;
    }

    Swal.fire({
      title: 'Save?',
      icon: 'question',
      text: 'Are you sure you want to save?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save!',
    }).then((result) => {
      if (result.isConfirmed) {
        const timesheet: Timesheet = {
          timeSheetDetails: this.timesheetDetails.map(
            ({ total, ...overtime }) => overtime
          ),
        };

        this.timesheetService.SaveTimesheet(timesheet).subscribe(
          (response) => {
            this.formSubmitted.emit();
            this.overtimeService.clearWorks();
            Swal.fire({
              title: 'Success!',
              text: 'Your form has been saved.',
              icon: 'success',
            });
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'There was a problem submitting your form. Please try again later.',
            });
          }
        );
      }
    });
    // this.router.navigate(['/timesheets/list']);
  }
}
