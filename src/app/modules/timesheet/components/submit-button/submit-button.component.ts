import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime, Timesheet } from '../../model/timesheet';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [ToastModule, ConfirmDialogModule],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.scss',
  providers: [MessageService],
})
export class SubmitButtonComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<void>();
  timesheet: Timesheet = {} as Timesheet;
  timesheetDetails: Overtime[] = [];

  constructor(
    private messageService: MessageService,
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
      this.messageService.add({
        severity: 'error',
        summary: 'Error Occurred',
        detail: `Please add overtime first!`,
      });
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
          timeSheetDetails: this.timesheetDetails.map((overtime) => {
            return {
              date: overtime.date,
              startTime: new Date(overtime.startTime),
              endTime: new Date(overtime.endTime),
              workId: overtime.workId,
            };
          }),
        };

        this.timesheetService.SaveTimesheet(timesheet).subscribe(
          () => {
            this.formSubmitted.emit();
            this.overtimeService.clearWorks();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Your form has been saved`,
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Occurred',
              detail: `There was a problem submitting your form. Please try again later`,
            });
          }
        );
        this.router.navigate(['/timesheets/list']);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `You have rejected`,
        });
      },
    });
  }
}
