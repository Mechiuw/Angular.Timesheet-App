import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

import { TimeSheetDetail, Timesheet } from '../../../model/timesheet';
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
  selectedTimesheet: Timesheet = {} as Timesheet;
  timesheetDetails: TimeSheetDetail[] = [];

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
      life: 3000,
      styleClass: 'text-sm',
    });
  }

  // Generate Data
  generateDummyData() {
    this.selectedTimesheet = {
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
