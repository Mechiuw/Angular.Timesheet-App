import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

import { DetailTimesheetEntry, TimesheetEntry } from '../../../model/timesheet';
import { TimesheetDetailTableComponent } from '../timesheet-detail-table/timesheet-detail-table.component';

@Component({
  selector: 'app-timesheet-modal-print',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ToastModule,
    SkeletonModule,
    TimesheetDetailTableComponent,
  ],
  templateUrl: './timesheet-modal-print.component.html',
  styleUrl: './timesheet-modal-print.component.scss',
  providers: [MessageService],
})
export class TimesheetModalPrintComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  // Data from Parent
  @Input() visiblePrint: boolean = false;
  @Input() paramTimesheetId: string | null = '';

  // Data Timesheet
  selectedTimesheet: TimesheetEntry = {} as TimesheetEntry;
  timesheetDetails: DetailTimesheetEntry[] = [];

  // Data Loading
  isLoading: boolean = true;

  // Data Current Date
  currentDate: Date = new Date();

  // Toast Notification Message
  showInfo() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail:
        'Ctrl + P to Print and Uncheked Header and Footer in Option Print',
      life: 5000,
      styleClass: 'text-sm',
    });
  }

  // Generate Data
  generateDummyData() {
    this.selectedTimesheet = {
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
    };
  }
  ngOnInit(): void {
    // Show Toast Information after a slight delay to ensure rendering
    setTimeout(() => {
      this.showInfo();
    }, 0);

    setTimeout(() => {
      this.isLoading = false;
      this.generateDummyData();
    }, 500);
  }
}
