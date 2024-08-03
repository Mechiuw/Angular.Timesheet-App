import { Component, Input, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

import { DetailTimesheetEntry, TimesheetEntry } from '../../../model/timesheet';
import { TimesheetDetailTableComponent } from '../timesheet-detail-table/timesheet-detail-table.component';

@Component({
  selector: 'app-timesheet-modal-print',
  standalone: true,
  imports: [DialogModule, TimesheetDetailTableComponent],
  templateUrl: './timesheet-modal-print.component.html',
  styleUrl: './timesheet-modal-print.component.scss',
})
export class TimesheetModalPrintComponent implements OnInit {
  // Data from Parent
  @Input() visiblePrint: boolean = false;
  @Input() paramTimesheetId: string | null = '';

  // Data Timesheet
  selectedTimesheet: TimesheetEntry = {} as TimesheetEntry;
  timesheetDetails: DetailTimesheetEntry[] = [];

  ngOnInit(): void {
    // Generate Dummy Data
    this.selectedTimesheet = {
      id: 'entry1',
      user: 'user1',
      status: 'pending',
      totalFee: 3500,
      createdAt: new Date('2024-08-01T10:00:00Z'),
      updatedAt: new Date('2024-08-01T12:00:00Z'),
      deletedAt: undefined,
      manager: 'manager1',
      benefit: 'Team Alpha',
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
    };
  }
}
