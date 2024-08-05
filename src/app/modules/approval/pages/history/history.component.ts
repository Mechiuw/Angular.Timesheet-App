import { Component, OnInit } from '@angular/core';
import { NftHeaderComponent } from '../../components/nft/nft-header/nft-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';
import { Timesheet } from '../../model/timesheet';

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
  timesheets: Timesheet[] = [];

  // Example Route
  route: string = 'history';

  // Example Role (comment out if you want to use it)
  // role: string = 'manager';
  role: string = 'benefit';

  // Generate Data
  generateDummyData() {
    this.timesheets = [
      {
        id: 'h7i8j9k0-12a3-4567-b890-c1d2e3f4g567',
        createdAt: '2024-06-01T07:00:00+07:00',
        updatedAt: '2024-08-05T14:16:21.185459+07:00',
        statusByManager: 'Pending',
        statusByBenefit: 'Pending',
        confirmedManagerBy: {
          userId: '',
          name: '',
          email: '',
          signatureUrl: '',
        },
        confirmedBenefitBy: {
          userId: '',
          name: '',
          email: '',
          signatureUrl: '',
        },
        user: {
          id: 'h8i9j0k1-23a4-5678-b9cd-ef0123456789',
          name: 'Ethan Turner',
          email: 'ethan.turner@example.com',
          signatureUrl: 'https://example.com/signature/ethan-turner',
        },
        timeSheetDetails: [
          {
            id: '88j9k0l1-23a4-5678-c9de-f0g1h2i3j456',
            date: '2024-07-10T00:00:00+07:00',
            startTime: '2024-07-10T09:00:00+07:00',
            endTime: '2024-07-10T17:00:00+07:00',
            workId: 'g7h8i9j0-1234-5678-90ab-cdef01234567',
            description: 'Mengajar React Native',
            subTotal: 180000,
          },
        ],
        total: 180000,
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
