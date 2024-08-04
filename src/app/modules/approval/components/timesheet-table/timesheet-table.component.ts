import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

import { TimesheetEntry } from '../../model/timesheet';
import { TimesheetDetailTableComponent } from './timesheet-detail-table/timesheet-detail-table.component';
import { TimesheetModalPrintComponent } from './timesheet-modal-print/timesheet-modal-print.component';

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
    SkeletonModule,
    CommonModule,
    TimesheetDetailTableComponent,
    TimesheetModalPrintComponent,
  ],
  templateUrl: './timesheet-table.component.html',
  styleUrls: ['./timesheet-table.component.scss'],
})
export class TimesheetTableComponent implements OnInit {
  // Constructor
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  // Data Url & Params
  urlTimesheetId?: string | null;
  paramTimesheetId?: string | null;

  // Data from Parent
  @Input() isLoading: boolean = true;
  @Input() timesheets: TimesheetEntry[] = [];
  @Input() route!: string;
  @Input() role!: string;

  // Data Selected Timesheet
  selectedTimesheet: TimesheetEntry = {} as TimesheetEntry;

  // Data Modal
  visibleDetail: boolean = false;
  visiblePrint: boolean = false;

  // Function Modal
  showDialogDetail(timesheet: TimesheetEntry) {
    this.selectedTimesheet = timesheet;
    this.visibleDetail = true;
  }

  showDialogPrint(timesheet: TimesheetEntry) {
    this.selectedTimesheet = timesheet;

    // Navigate to Url Print
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/approvals/history/print/${timesheet.id}`])
    );

    // Open the URL in a new tab
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    // Get Route from URL
    const currentRoute = this.router.url.split('/');
    this.urlTimesheetId = currentRoute[currentRoute.length - 2];

    // Get param 'timesheetId' from URL
    this.activatedRoute.firstChild?.paramMap.subscribe({
      next: (paramMap) => {
        // Set Data
        this.paramTimesheetId = paramMap.get('timesheetId');

        // conditional modal print
        if (this.paramTimesheetId && this.urlTimesheetId == 'print') {
          this.visiblePrint = true;
        }
      },
    });
  }
}
