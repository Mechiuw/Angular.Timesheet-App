import { Component, OnInit } from '@angular/core';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';
import { Timesheet } from '../../model/timesheet';
import { Routes } from '../../../../core/constants/routes';
import { Roles } from '../../../../core/constants/roles';
import { StatusTimesheets } from '../../../../core/constants/status-timesheets';

// import for service session
import { SessionService } from '../../../../core/services/session.service';
import { UserInfo } from '../../../../core/models/user-info.model';
import { BehaviorSubject } from 'rxjs';

import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-on-progress',
  standalone: true,
  imports: [TitleHeaderComponent, TimesheetTableComponent],
  templateUrl: './on-progress.component.html',
  styleUrl: './on-progress.component.scss',
})
export class OnProgressComponent implements OnInit {
  // Data user from session
  private currentUser$: BehaviorSubject<UserInfo | null>;

  // Constructor for Current User and Service
  constructor(
    private readonly sessionService: SessionService,
    private readonly timesheetService: TimesheetService
  ) {
    this.currentUser$ = new BehaviorSubject<UserInfo | null>(
      sessionService.getCurrentUser()
    );
  }

  // Data Loading
  isLoading: boolean = true;

  // NFT Header
  title: string = 'Timesheets Approvals';
  subtitle: string = 'On Progress';

  // Data Timesheet
  timesheets: Timesheet[] = [];

  // Data Route
  route: string = Routes.OnProgress;

  // Data Role
  role: string = '';

  // Data Query param
  queryParam: string = '';

  // Get Timesheet By Auth
  getAllTimesheetByAuth() {
    // Enable Loading
    this.isLoading = true;

    switch (this.role) {
      // Role User
      case Roles.User: {
        // Set Query Param
        this.queryParam = '&userId=' + this.currentUser$.value?.id;

        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressUserRole = timesheet.data.filter(
              (timesheet) =>
                timesheet.status === StatusTimesheets.Pending ||
                timesheet.status === StatusTimesheets.Accepted
            );

            // Set Data
            this.timesheets = timesheetsOnProgressUserRole;

            // Disable Loading
            this.isLoading = false;
          });
        break;
      }
      // Role Admin
      case Roles.Admin: {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) =>
                timesheet.status === StatusTimesheets.Pending ||
                timesheet.status === StatusTimesheets.Accepted
            );

            // Set Data
            this.timesheets = timesheetsOnProgressAdminRole;

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
      // Role Manager
      case Roles.Manager: {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressManagerRole = timesheet.data.filter(
              (timesheet) => timesheet.status === StatusTimesheets.Pending
            );

            // Set Data
            this.timesheets = timesheetsOnProgressManagerRole;

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
      // Role Benefit
      case Roles.Benefit: {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressBenefitRole = timesheet.data.filter(
              (timesheet) => timesheet.status === StatusTimesheets.Accepted
            );

            // Set Data
            this.timesheets = timesheetsOnProgressBenefitRole;

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
    }
  }

  ngOnInit() {
    // Get Data Current User
    this.currentUser$.subscribe((user) => {
      this.role = user?.role!;
    });

    // Get Timesheet
    this.getAllTimesheetByAuth();
  }
}
