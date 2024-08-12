import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Timesheet } from '../../model/timesheet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TimesheetService } from '../../services/timesheet.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    SkeletonModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [MessageService],
})
export class TableComponent {
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  private router = inject(Router);
  private timesheetService = inject(TimesheetService);

  @Input() dataTable: Timesheet[] = [];
  @Output() refresh = new EventEmitter<void>();

  editTimesheet(id: number) {
    this.router.navigate(['/timesheets/update/' + id]);
  }

  submitTimesheet(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to submit?',
      header: 'Submit Confirmation',
      icon: 'pi pi-question',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.timesheetService.SubmitTimesheet(id).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Your timesheet has been submitted',
            });
            this.refresh.emit();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Occurred',
              detail:
                'Failed to submit timesheet, submit only on the 19th and 20th each month',
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'You have rejected',
        });
      },
    });
  }

  viewTimesheet(id: number) {
    this.router.navigate(['/timesheets/view/' + id]);
  }

  deleteTimesheet(id: string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.timesheetService.DeleteTimesheet(id).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Your timesheet has been deleted',
            });
            this.refresh.emit();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error Occurred',
              detail:
                'There was a problem deleting the timesheet. Please try again later',
            });
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'You have rejected',
        });
      },
    });
  }
}
