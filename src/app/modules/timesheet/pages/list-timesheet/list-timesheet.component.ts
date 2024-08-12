import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Timesheet } from '../../model/timesheet';
import { TimesheetService } from '../../services/timesheet.service';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { ButtonDirective } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-list-timesheet',
  standalone: true,
  imports: [
    TableComponent,
    TableModule,
    CommonModule,
    TitleHeaderComponent,
    ButtonDirective,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './list-timesheet.component.html',
  styleUrl: './list-timesheet.component.scss',
})
export class ListTimesheetComponent implements OnInit {
  title: string = 'Timesheet List';
  subtitle: string = 'Created Timesheets';

  ngOnInit(): void {
    this.fetchData();
  }

  private readonly timesheetService = inject(TimesheetService);
  timesheets: Timesheet[] = [];

  fetchData(): void {
    this.timesheetService
      .GetTimesheet()
      .subscribe((response) => (this.timesheets = response));
  }

  refresh(): void {
    this.fetchData();
  }
}
