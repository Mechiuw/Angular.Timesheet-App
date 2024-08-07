import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

import { Timesheet } from '../../model/timesheet';
import { TimesheetDetailTableComponent } from './timesheet-detail-table/timesheet-detail-table.component';
import { TimesheetModalPrintComponent } from './timesheet-modal-print/timesheet-modal-print.component';
import { StatusTimesheets } from '../../../../core/constants/status-timesheets';
import { Roles } from '../../../../core/constants/roles';
import { Routes } from '../../../../core/constants/routes';

import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-timesheet-table',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    SkeletonModule,
    ConfirmPopupModule,
    ToastModule,
    CommonModule,
    FormsModule,
    TimesheetDetailTableComponent,
    TimesheetModalPrintComponent,
  ],
  templateUrl: './timesheet-table.component.html',
  styleUrls: ['./timesheet-table.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class TimesheetTableComponent implements OnInit {
  // Constructor
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private readonly timesheetService: TimesheetService
  ) {}

  @ViewChild('dt') dt: Table | undefined;

  // Data Search
  searchValue: string | undefined;

  //  Apply Filter Search
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Data Url & Params
  urlTimesheetId?: string | null;
  paramTimesheetId?: string | null;

  // Data Enum Roles
  RolesEnum = {
    User: Roles.User,
    Admin: Roles.Admin,
    Manager: Roles.Manager,
    Benefit: Roles.Benefit,
  };

  // Data Enum Route
  RoutesEnum = {
    OnProgress: Routes.OnProgress,
    History: Routes.History,
  };

  // Data Enum Status Timesheet
  StatusTimesheetsEnum = {
    Pending: StatusTimesheets.Pending,
    Accepted: StatusTimesheets.Accepted,
    Denied: StatusTimesheets.Denied,
    Approved: StatusTimesheets.Approved,
    Rejected: StatusTimesheets.Rejected,
  };

  // Data and Function from Parent
  @Input() isLoading: boolean = true;
  @Input() timesheets: Timesheet[] = [];
  @Input() route!: string;
  @Input() role!: string;
  @Output() getAllTimesheetByAuth = new EventEmitter<void>();
  @Output() checkDeleteAllData = new EventEmitter<void>();

  // Data Selected Timesheet
  selectedTimesheet: Timesheet = {} as Timesheet;

  // Data Modal
  visibleDetail: boolean = false;
  visiblePrint: boolean = false;

  // Function Modal
  showDialogDetail(timesheet: Timesheet) {
    this.selectedTimesheet = timesheet;
    this.visibleDetail = true;
  }

  showDialogPrint(timesheet: Timesheet) {
    this.selectedTimesheet = timesheet;

    // Navigate to Url Print
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/approvals/history/print/${timesheet.id}`])
    );

    // Open the URL in a new tab
    window.open(url, '_blank');
  }

  // Notification Success and reload data
  reloadSuccessY() {
    // Show Message
    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail:
        status === StatusTimesheets.Accepted
          ? 'Timesheet approved'
          : 'Timesheet accepted',
      life: 3000,
    });

    // Call Service Funtion from Parent to Update Data
    this.getAllTimesheetByAuth.emit();
  }

  reloadSuccessX() {
    // Show Message
    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail:
        status === StatusTimesheets.Accepted
          ? 'Timesheet rejected'
          : 'Timesheet denied',
      life: 3000,
    });

    // Call Service Funtion from Service
    this.getAllTimesheetByAuth.emit();
  }

  // Function Confirmation Button
  // Accept or Approve Timesheet
  confirmY(event: Event, status: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        status === StatusTimesheets.Accepted
          ? 'Are you sure to approve'
          : 'Are you sure to accept' + ' timesheet ?',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        // Process Data
        if (status === StatusTimesheets.Pending) {
          // Update Status to 'accepted' (call service)
          this.timesheetService
            .acceptTimesheetByManager(this.selectedTimesheet.id)
            .subscribe(() => {
              // Reload Data
              this.reloadSuccessY();
            });
        } else if (status === StatusTimesheets.Accepted) {
          // Update Status to 'approved' (call service)
          this.timesheetService
            .approveTimesheetByBenefit(this.selectedTimesheet.id)
            .subscribe(() => {
              // Reload Data
              this.reloadSuccessY();
            });
        }
      },

      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelled',
          detail: 'You have cancelled action',
          life: 3000,
        });
      },
    });
  }

  // Deny or Reject Timesheet
  confirmX(event: Event, status: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        status === StatusTimesheets.Accepted
          ? 'Are you sure to reject'
          : 'Are you sure to deny' + ' timesheet ?',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        // Process Data
        if (status === StatusTimesheets.Pending) {
          // Update Status to 'denied'
          this.timesheetService
            .denyTimesheetByManager(this.selectedTimesheet.id)
            .subscribe(() => {
              // Reload Data
              this.reloadSuccessX();
            });
        } else if (status === StatusTimesheets.Accepted) {
          // Update Status to 'rejected'
          this.timesheetService
            .rejectTimesheetByBenefit(this.selectedTimesheet.id)
            .subscribe(() => {
              // Reload Data
              this.reloadSuccessX();
            });
        }
      },

      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Cancelled',
          detail: 'You have cancelled action',
          life: 3000,
        });
      },
    });
  }

  ngOnInit(): void {
    // Get Route from URL
    const currentRoute = this.router.url.split('/');
    this.urlTimesheetId = currentRoute[currentRoute.length - 2];

    // Get param 'timesheetId' from URL
    this.activatedRoute.firstChild?.paramMap.subscribe({
      next: (paramMap) => {
        // Set Data
        this.paramTimesheetId = paramMap.get('timesheetId');

        // conditional modal print
        if (this.paramTimesheetId && this.urlTimesheetId == 'print') {
          this.visiblePrint = true;
        }
      },
    });
  }
}
