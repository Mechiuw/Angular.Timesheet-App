import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';

import { DetailTimesheetEntry } from '../../../model/timesheet';

@Component({
  selector: 'app-timesheet-detail-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './timesheet-detail-table.component.html',
  styleUrl: './timesheet-detail-table.component.scss',
})
export class TimesheetDetailTableComponent {
  // Data from Parent
  @Input() timesheetDetails: DetailTimesheetEntry[] = [];
}
