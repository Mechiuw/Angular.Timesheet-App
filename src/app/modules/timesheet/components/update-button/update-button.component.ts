import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { Overtime, Timesheet } from '../../model/timesheet';
import { TimesheetService } from '../../services/timesheet.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-update-button',
  standalone: true,
  imports: [ToastModule, ConfirmDialogModule],
  templateUrl: './update-button.component.html',
  styleUrl: './update-button.component.scss',
})
export class UpdateButtonComponent implements OnInit {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  @Input() timesheetId: string = '';
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

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to update?',
      header: 'Update Confirmation',
      icon: 'pi pi-question',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
        const timesheet: Timesheet = {
          timeSheetDetails: this.timesheetDetails.map(
            ({ total, ...overtime }) => overtime
          ),
        };

        this.timesheetService
          .UpdateTimesheet(this.timesheetId, timesheet)
          .subscribe(
            () => {
              this.formSubmitted.emit();
              this.update.clearWorks();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Your form has been updated',
              });
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error Occurred',
                detail:
                  'There was a problem updating your form. Please try again later',
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
