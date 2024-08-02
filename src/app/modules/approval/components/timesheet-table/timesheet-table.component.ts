import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { TimesheetDetailTableComponent } from './timesheet-detail-table/timesheet-detail-table.component';

import { DetailTimesheetEntry, TimesheetEntry } from '../../model/timesheet';

@Component({
  selector: 'app-timesheet-table',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    CommonModule,
    TimesheetDetailTableComponent,
  ],
  templateUrl: './timesheet-table.component.html',
  styleUrls: ['./timesheet-table.component.scss'],
})
export class TimesheetTableComponent {
  // Constructor
  constructor(private router: Router) {}

  // Data from Parent
  @Input() timesheets: TimesheetEntry[] = [];
  @Input() route!: string;
  @Input() role!: string;

  // Data Selected Timesheet
  selectedTimesheet: any;

  // Data Modal
  visibleDetail: boolean = false;
  visibleConfirm: boolean = false;
  visiblePrint: boolean = false;

  // Data Timesheet Detail
  timesheetDetails: DetailTimesheetEntry[] = [];

  // Function Modal
  showDialogDetail(timesheet: TimesheetEntry) {
    this.selectedTimesheet = timesheet;
    this.visibleDetail = true;
  }

  showDialogConfirm(timesheet: TimesheetEntry) {
    this.selectedTimesheet = timesheet;
    this.visibleConfirm = true;
  }
  showDialogPrint(timesheet: TimesheetEntry) {
    this.selectedTimesheet = timesheet;
    this.visiblePrint = true;

    // Navigate to Url Print
    this.router.navigate([`/approvals/history/${timesheet.id}`]);
  }

  onDialogPrintClose() {
    this.selectedTimesheet = null;
    this.visiblePrint = false;

    // Navigate to Back
    this.router.navigate([`/approvals/history`]);
  }
}
