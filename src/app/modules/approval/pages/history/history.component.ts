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
  selector: 'app-history',
  standalone: true,
  imports: [NftHeaderComponent, TimesheetTableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  // Data user from session
  private currentUser$: BehaviorSubject<UserInfo | null>;

  // Constructor for Current User
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
  subtitle: string = 'History';

  // Example Timesheet
  timesheets: Timesheet[] = [];

  // Example Route
  route: string = 'history';

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
                timesheet.status === 'deny' ||
                timesheet.status === 'approved' ||
                timesheet.status === 'rejected'
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
                timesheet.status === 'deny' ||
                timesheet.status === 'approved' ||
                timesheet.status === 'rejected'
            );
            this.timesheets = timesheetsOnProgressAdminRole;

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
      case 'manager': {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) =>
                timesheet.status === 'accept' || timesheet.status === 'deny'
            );

            // Disable Loading
            this.isLoading = false;
          });

        break;
      }
      case 'benefit': {
        // Get Timesheet Data
        this.timesheetService
          .getAllTimesheet(this.queryParam)
          .subscribe((timesheet) => {
            // Filter Timesheet
            const timesheetsOnProgressAdminRole = timesheet.data.filter(
              (timesheet) =>
                timesheet.status === 'approved' || timesheet.status === 'rejected'
            );

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
