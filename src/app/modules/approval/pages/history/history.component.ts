import { Component, OnInit } from '@angular/core';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';
import { TimesheetEntry } from '../../model/timesheet';

// import for service session
import { SessionService } from '../../../../core/services/session.service';
import { UserInfo } from '../../../../core/models/user-info.model';
import { BehaviorSubject } from 'rxjs';

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
  constructor(private readonly sessionService: SessionService) {
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
  timesheets: TimesheetEntry[] = [];

  // Example Route
  route: string = 'history';

  // Example Role (comment out if you want to use it)
  // role: string = 'manager';
  role: string = 'benefit';

  // Generate Data
  generateDummyData() {
    this.timesheets = [
      {
        id: 'entry1',
        user: 'user1',
        status: 'pending', // Updated status
        totalFee: 3500,
        createdAt: new Date('2024-08-01T10:00:00Z'),
        updatedAt: new Date('2024-08-01T12:00:00Z'),
        deletedAt: undefined,
        manager: 'manager1',
        benefit: 'Team Alpha', // Updated benefit field
        detail: [
          {
            workId: 'work101',
            fee: 1500,
            startTime: new Date('2024-08-01T10:00:00Z'),
            endTime: new Date('2024-08-01T12:00:00Z'),
            date: '2024-08-01',
          },
          {
            workId: 'work102',
            fee: 2000,
            startTime: new Date('2024-08-01T13:00:00Z'),
            endTime: new Date('2024-08-01T15:00:00Z'),
            date: '2024-08-01',
          },
          {
            workId: 'work103',
            fee: 1500,
            startTime: new Date('2024-08-01T16:00:00Z'),
            endTime: new Date('2024-08-01T18:00:00Z'),
            date: '2024-08-01',
          },
        ],
      },
      {
        id: 'entry2',
        user: 'user2',
        status: 'approved', // Updated status
        totalFee: 1700,
        createdAt: new Date('2024-08-02T11:00:00Z'),
        updatedAt: new Date('2024-08-02T13:00:00Z'),
        deletedAt: new Date('2024-08-03T14:00:00Z'),
        manager: 'manager2',
        benefit: 'Team Beta', // Updated benefit field
        detail: [
          {
            workId: 'work103',
            fee: 1700,
            startTime: new Date('2024-08-02T11:00:00Z'),
            endTime: new Date('2024-08-02T14:00:00Z'),
            date: '2024-08-02',
          },
          {
            workId: 'work104',
            fee: 2000,
            startTime: new Date('2024-08-02T15:00:00Z'),
            endTime: new Date('2024-08-02T17:00:00Z'),
            date: '2024-08-02',
          },
        ],
      },
      {
        id: 'entry3',
        user: 'user3',
        status: 'settlement', // Updated status
        totalFee: 1800,
        createdAt: new Date('2024-08-03T09:00:00Z'),
        updatedAt: new Date('2024-08-03T10:00:00Z'),
        deletedAt: undefined,
        manager: 'manager3',
        benefit: 'Team Gamma', // Updated benefit field
        detail: [
          {
            workId: 'work104',
            fee: 1800,
            startTime: new Date('2024-08-03T09:00:00Z'),
            endTime: new Date('2024-08-03T12:00:00Z'),
            date: '2024-08-03',
          },
        ],
      },
      {
        id: 'entry4',
        user: 'user4',
        status: 'pending', // Updated status
        totalFee: 1600,
        createdAt: new Date('2024-08-04T08:00:00Z'),
        updatedAt: new Date('2024-08-04T10:00:00Z'),
        deletedAt: undefined,
        manager: 'manager4',
        benefit: 'Team Delta', // Updated benefit field
        detail: [
          {
            workId: 'work105',
            fee: 1600,
            startTime: new Date('2024-08-04T08:00:00Z'),
            endTime: new Date('2024-08-04T11:00:00Z'),
            date: '2024-08-04',
          },
        ],
      },
      {
        id: 'entry5',
        user: 'user5',
        status: 'approved', // Updated status
        totalFee: 1900,
        createdAt: new Date('2024-08-05T12:00:00Z'),
        updatedAt: new Date('2024-08-05T14:00:00Z'),
        deletedAt: new Date('2024-08-06T15:00:00Z'),
        manager: 'manager5',
        benefit: 'Team Epsilon', // Updated benefit field
        detail: [
          {
            workId: 'work106',
            fee: 1900,
            startTime: new Date('2024-08-05T12:00:00Z'),
            endTime: new Date('2024-08-05T15:00:00Z'),
            date: '2024-08-05',
          },
        ],
      },
      {
        id: 'entry6',
        user: 'user6',
        status: 'settlement', // Updated status
        totalFee: 1750,
        createdAt: new Date('2024-08-06T13:00:00Z'),
        updatedAt: new Date('2024-08-06T16:00:00Z'),
        deletedAt: undefined,
        manager: 'manager6',
        benefit: 'Team Zeta', // Updated benefit field
        detail: [
          {
            workId: 'work107',
            fee: 1750,
            startTime: new Date('2024-08-06T13:00:00Z'),
            endTime: new Date('2024-08-06T16:00:00Z'),
            date: '2024-08-06',
          },
        ],
      },
    ];
  }

  ngOnInit() {
    // Get Data Current User
    this.currentUser$.subscribe((user) => {
      console.log(user);
      this.role = user?.role!;
    });

    setTimeout(() => {
      this.isLoading = false;
      this.generateDummyData();
    }, 3000);
  }
}
