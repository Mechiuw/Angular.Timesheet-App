import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Timesheet } from '../../model/timesheet';
import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-list-timesheet',
  standalone: true,
  imports: [TableComponent, TableModule, CommonModule],
  templateUrl: './list-timesheet.component.html',
  styleUrl: './list-timesheet.component.scss',
})
export class ListTimesheetComponent implements OnInit {

  private readonly timesheetService = inject(TimesheetService);
  isLoading: boolean = true;
  title: string = 'Timesheet List';
  subtitle: string = 'Created Timesheets';

  ngOnInit(): void {
    this.fetchData();
    this.timesheetService.isLoading.subscribe((value) => {
      this.isLoading = value
    })
  }

  timesheets: Timesheet[] = [];

  fetchData(): void {
    this.timesheetService
      .GetTimesheet()
      .subscribe((response) => {
        this.timesheets = response
        this.isLoading = false;
      });
  }

  refresh(): void {
    this.fetchData();
  }
}
