import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';

import { Timesheet } from '../../../model/timesheet';

@Component({
  selector: 'app-timesheet-detail-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './timesheet-detail-table.component.html',
  styleUrl: './timesheet-detail-table.component.scss',
})
export class TimesheetDetailTableComponent {
  // Data from Parent
  @Input() selectedTimesheet: Timesheet = {} as Timesheet;

  // Data Duration
  timeDifference: string = '';

  calculateTimeDifference(index: number): string {
    // Parse the ISO 8601 date strings into Date objects
    const start = new Date(this.selectedTimesheet.timeSheetDetails[index].startTime);
    const end = new Date(this.selectedTimesheet.timeSheetDetails[index].endTime);

    // Calculate the difference in milliseconds
    const difference = end.getTime() - start.getTime();

    // Convert milliseconds to hours and minutes
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    this.timeDifference = ` (${hours} hours)`;    

   return this.timeDifference;
  }
}
