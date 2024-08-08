import { Component, OnInit } from '@angular/core';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';
import { Timesheet } from '../../model/timesheet.model';
import { Routes } from '../../../../core/constants/routes';
import { Roles } from '../../../../core/constants/roles';
import { StatusTimesheets } from '../../../../core/constants/status-timesheets';

// import for service session
import { UserInfo } from '../../../../core/models/user-info.model';
import { BehaviorSubject } from 'rxjs';
import { SessionService } from '../../../../core/services/session.service';

import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TitleHeaderComponent, TimesheetTableComponent],
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
  route: string = Routes.HISTORY;

  // Data Role
  role: string = '';

  // Data Query param
  queryParam: string = '';

  // Get Timesheet By Auth
  getTimesheetsFromService() {
    // Enable Loading
    this.isLoading = true;

    // Get Timesheet Data
    this.timesheetService
      .getAllTimesheetByAuth(this.role, this.route)
      .subscribe((timesheet) => {
        // Set Data
        this.timesheets = timesheet.data;

        // Disable Loading
        this.isLoading = false;
      });
  }
  ngOnInit() {
    // Get Data Current User
    this.currentUser$.subscribe((user) => {
      this.role = user?.role!;
    });

    // Get Timesheet
    this.getTimesheetsFromService();
  }
}
