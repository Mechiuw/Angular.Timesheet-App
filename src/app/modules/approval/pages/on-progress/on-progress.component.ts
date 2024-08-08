import { Component } from '@angular/core';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { TimesheetTableComponent } from '../../components/timesheet-table/timesheet-table.component';

@Component({
  selector: 'app-on-progress',
  standalone: true,
  imports: [TitleHeaderComponent, TimesheetTableComponent],
  templateUrl: './on-progress.component.html',
  styleUrl: './on-progress.component.scss',
})
export class OnProgressComponent {
  // NFT Header
  title: string = 'Timesheets Approvals';
  subtitle: string = 'On Progress';
}
