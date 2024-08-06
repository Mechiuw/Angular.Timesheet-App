import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';

import { TimeSheetDetail, Timesheet } from '../../../model/timesheet';
import { TimesheetDetailTableComponent } from '../timesheet-detail-table/timesheet-detail-table.component';

import { TimesheetService } from '../../../services/timesheet.service';

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
  constructor(
    private messageService: MessageService,
    private readonly timesheetService: TimesheetService
  ) {}

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

  // Get Timesheet By Id from Service
  getTimesheetById() {
    if (this.paramTimesheetId) {
      this.timesheetService
        .getTimesheetById(this.paramTimesheetId)
        .subscribe((timesheet) => {
          this.isLoading = false;
          this.selectedTimesheet = timesheet.data;
        });
    }
  }

  ngOnInit(): void {
    // Show Toast Information after a slight delay to ensure rendering
    setTimeout(() => {
      this.showInfo();
    }, 0);

    // Get Timesheet By Id
    this.getTimesheetById();
  }
}
