import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime, Timesheet } from '../../model/timesheet';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [ToastModule, ConfirmDialogModule],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.scss',
})
export class SubmitButtonComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  timesheet: Timesheet = {} as Timesheet;
  timesheetDetails: Overtime[] = [];

  constructor(
    private toaster: ToastrService,
    private confirmationService: ConfirmationService,
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

  confirm(event: Event) {
    this.ngOnInit();

    if (this.timesheetDetails.length === 0) {
      this.toaster.error('Please add overtime first!', 'Error Occurred');
      return;
    }

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to save?',
      header: 'Submit Confirmation',
      icon: 'pi pi-question',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        const timesheet: Timesheet = {
          timeSheetDetails: this.timesheetDetails.map(overtime => {
            return {
              "date": overtime.date,
              "startTime": new Date(overtime.startTime),
              "endTime": new Date(overtime.endTime),
              "workId": overtime.workId,
            }
          })
        };

        this.timesheetService.SaveTimesheet(timesheet).subscribe(
          () => {
            this.formSubmitted.emit();
            this.overtimeService.clearWorks();
            this.toaster.success('Your form has been saved', 'Success');
          },
          () => {
            this.toaster.error(
              'There was a problem submitting your form. Please try again later',
              'Error Occurred'
            );
          }
        );
        this.router.navigate(['/timesheets/list']);
      },
      reject: () => {
        this.toaster.info('You have rejected', 'Info');
      },
    });
  }
}
