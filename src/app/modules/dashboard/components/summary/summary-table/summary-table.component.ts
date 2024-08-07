import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TimesheetSummary } from '../../../../approval/model/timesheet';

@Component({
  selector: 'app-summary-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ToolbarModule,
    InputTextModule,
    TooltipModule,
    SkeletonModule,
    CommonModule,
  ],
  templateUrl: './summary-table.component.html',
  styleUrl: './summary-table.component.scss'
})
export class SummaryTableComponent implements OnInit {
  // Constructor
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  // Data Url & Params
  urlTimesheetId?: string | null;
  paramTimesheetId?: string | null;

  // Data from Parent
  @Input() isLoading: boolean = true;
  @Input() timesheets: TimesheetSummary[] = [];
  @Input() route!: string;
  @Input() role!: string;

  // Data Selected Timesheet
  selectedTimesheet: TimesheetSummary = {} as TimesheetSummary;

  // Data Modal
  visibleDetail: boolean = false;
  visiblePrint: boolean = false;

  // Function Modal
  showDialogDetail(timesheet: TimesheetSummary) {
    this.selectedTimesheet = timesheet;
    this.visibleDetail = true;
  }

  showDialogPrint(timesheet: TimesheetSummary) {
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
