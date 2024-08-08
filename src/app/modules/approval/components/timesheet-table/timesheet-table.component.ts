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
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

import { Timesheet } from '../../model/timesheet';
import { TimesheetDetailTableComponent } from './timesheet-detail-table/timesheet-detail-table.component';
import { TimesheetModalPrintComponent } from './timesheet-modal-print/timesheet-modal-print.component';
import { StatusTimesheets } from '../../../../core/constants/status-timesheets';
import { Roles } from '../../../../core/constants/roles';
import { Routes } from '../../../../core/constants/routes';

// import for service session
import { SessionService } from '../../../../core/services/session.service';
import { UserInfo } from '../../../../core/models/user-info.model';
import { BehaviorSubject } from 'rxjs';

import { TimesheetService } from '../../services/timesheet.service';
import { PagedResponse } from '../../../../core/models/api.model';

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
  // Data user from session
  private currentUser$: BehaviorSubject<UserInfo | null>;

  // Constructor
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private readonly sessionService: SessionService,
    private readonly timesheetService: TimesheetService
  ) {
    this.currentUser$ = new BehaviorSubject<UserInfo | null>(
      sessionService.getCurrentUser()
    );
  }

  @ViewChild('dt') dt: Table | undefined;

  // Data Loading
  isLoading: boolean = true;

  // Data Timesheet
  timesheets: Timesheet[] = [];

  // Data Role
  role: string = '';

  // Data Search
  searchValue: string = '';

  // Data Route Url & Params
  urlTimesheetId?: string | null;
  paramTimesheetId?: string | null;
  route: string = '';

  // Data Enum Roles
  RolesEnum = {
    USER: Roles.USER,
    ADMIN: Roles.ADMIN,
    MANAGER: Roles.MANAGER,
    BENEFIT: Roles.BENEFIT,
  };

  // Data Enum Route
  RoutesEnum = {
    ONPROGRESS: Routes.ONPROGRESS,
    HISTORY: Routes.HISTORY,
  };

  // Data Enum Status Timesheet
  StatusTimesheetsEnum = {
    PENDING: StatusTimesheets.PENDING,
    ACCEPTED: StatusTimesheets.ACCEPTED,
    DENIED: StatusTimesheets.DENIED,
    APPROVED: StatusTimesheets.APPROVED,
    REJECTED: StatusTimesheets.REJECTED,
  };

  // Data Selected Timesheet
  selectedTimesheet: Timesheet = {} as Timesheet;

  // Data Modal
  visibleDetail: boolean = false;
  visiblePrint: boolean = false;

  // Data Pagination
  first: number | undefined = 0;
  totalRecords: number = 0;
  page: number = 1;
  rowsOption: number[] = [5, 10, 50];

  // Function Filter
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  // Function Load Timesheet
  loadTimesheets($event: LazyLoadEvent) {
    this.isLoading = true;

    let rows = $event.rows;
    this.page = Math.ceil(($event?.first ?? 0) / ($event?.rows ?? 1)) + 1;

    // Get Timesheet Data with Pagination
    this.timesheetService
      .getAllTimesheetByAuth(
        this.role,
        this.route,
        rows ?? 1,
        this.page,
        this.searchValue
      )
      .subscribe({
        next: (response: PagedResponse<Timesheet[]>) => {
          // Set Data Pagination
          this.totalRecords = response.paging.totalRows;
          rows = response.paging.rowsPerPage;

          // Set Data Timesheet
          this.timesheets = response.data;

          // Disable Loading
          this.isLoading = false;
          console.log(response);
        },
        error: (error: any) => {
          console.error('Error fetching timesheet:', error);
        },
      });
  }

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
        status === StatusTimesheets.ACCEPTED
          ? 'Timesheet approved'
          : 'Timesheet accepted',
      life: 3000,
    });

    // Load Data
    this.loadTimesheets({ first: 0, rows: 5 });
  }

  reloadSuccessX() {
    // Show Message
    this.messageService.add({
      severity: 'success',
      summary: 'Updated',
      detail:
        status === StatusTimesheets.ACCEPTED
          ? 'Timesheet rejected'
          : 'Timesheet denied',
      life: 3000,
    });

    // Load Data
    this.loadTimesheets({ first: 0, rows: 5 });
  }

  // Function Confirmation Button
  // Accept or Approve Timesheet
  confirmY(event: Event, status: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        status === StatusTimesheets.ACCEPTED
          ? 'Are you sure to approve'
          : 'Are you sure to accept' + ' timesheet ?',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        // Process Data
        if (status === StatusTimesheets.PENDING) {
          // Update Status to 'accepted' (call service)
          this.timesheetService
            .acceptTimesheetByManager(this.selectedTimesheet.id)
            .subscribe(() => {
              // Reload Data
              this.reloadSuccessY();
            });
        } else if (status === StatusTimesheets.ACCEPTED) {
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
        status === StatusTimesheets.ACCEPTED
          ? 'Are you sure to reject'
          : 'Are you sure to deny' + ' timesheet ?',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        // Process Data
        if (status === StatusTimesheets.PENDING) {
          // Update Status to 'denied'
          this.timesheetService
            .denyTimesheetByManager(this.selectedTimesheet.id)
            .subscribe(() => {
              // Reload Data
              this.reloadSuccessX();
            });
        } else if (status === StatusTimesheets.ACCEPTED) {
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
    // Get Data Current User
    this.currentUser$.subscribe((user) => {
      this.role = user?.role!;
    });

    // Get Route from URL and Set Data
    const currentRoute = this.router.url.split('/');
    this.urlTimesheetId = currentRoute[currentRoute.length - 2];
    this.route = currentRoute[currentRoute.length - 1];

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
