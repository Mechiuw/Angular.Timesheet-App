import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TimesheetSummary } from '../../../../approval/model/timesheet.model';
import { StatusTimesheets } from '../../../../../core/constants/status-timesheets';
import { RupiahFormatPipe } from '../../../../../shared/pipes/rupiah-format.pipe';

@Component({
  selector: 'app-summary-table',
  standalone: true,
  imports: [
    RupiahFormatPipe,
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
  // Data from Parent
  @Input() isLoading: boolean = true;
  @Input() timesheets: TimesheetSummary[] = [];
  // Data Selected Timesheet
  selectedTimesheet: TimesheetSummary = {} as TimesheetSummary;
  StatusTimesheets: any = StatusTimesheets;
  ngOnInit(): void {
  }
}
