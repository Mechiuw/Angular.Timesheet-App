import { Component, OnInit } from '@angular/core';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';
import { Timesheet } from '../../model/timesheet';

// import for service session
import { SessionService } from '../../../../core/services/session.service';
import { UserInfo } from '../../../../core/models/user-info.model';
import { BehaviorSubject } from 'rxjs';

import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-on-progress',
  standalone: true,
  imports: [NftHeaderComponent, TimesheetTableComponent],
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
  route: string = 'on-progress';

  // Data Role
  role: string = '';

  // Data Query param
  queryParam: string = '';

  // Get Timesheet By Auth
  getAllTimesheetByAuth() {
    switch (this.role) {
      // Role User
      case 'user': {
        // Set Query Param
        this.queryParam = '&userId=' + this.currentUser$.value?.id;

        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) =>
                timesheet.status === 'pending' || timesheet.status === 'accept'
            );
            this.timesheets = timesheetsOnProgressAdminRole;

            // Disable Loading
            this.isLoading = false;
          });
        break;
      }
      // Role Admin
      case 'admin': {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) =>
                timesheet.status === 'pending' || timesheet.status === 'accept'
            );
            this.timesheets = timesheetsOnProgressAdminRole;

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
      // Role Manager
      case 'manager': {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) => timesheet.status === 'pending'
            );
            this.timesheets = timesheetsOnProgressAdminRole;

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
      // Role Benefit
      case 'benefit': {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) => timesheet.status === 'accept'
            );
            this.timesheets = timesheetsOnProgressAdminRole;

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
      console.log(user);
    });

    // Get Timesheet
    this.getAllTimesheetByAuth();
  }
}
