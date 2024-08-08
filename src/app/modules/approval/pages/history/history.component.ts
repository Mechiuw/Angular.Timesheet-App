import { Component } from '@angular/core';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [TitleHeaderComponent, TimesheetTableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  // NFT Header
  title: string = 'Timesheets Approvals';
  subtitle: string = 'History';
}
