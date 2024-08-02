import { Component, inject, OnInit } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { Timesheet } from '../../model/timesheet';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-timesheet',
  standalone: true,
  imports: [],
  templateUrl: './detail-timesheet.component.html',
  styleUrl: './detail-timesheet.component.scss',
})
export class DetailTimesheetComponent implements OnInit {
  private readonly timesheetService = inject(TimesheetService);
  private readonly route = inject(ActivatedRoute);

  detailTimesheet: Timesheet = {} as Timesheet;
  id: number = 0;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.id = +params['id'];
        this.getDetail(this.id);
      },
    });
  }

  getDetail(id: number): void {
    this.timesheetService.GetTimsheetById(id).subscribe({
      next: (response: Timesheet) => {
        this.detailTimesheet = response;
        console.log(this.detailTimesheet);
      },
    });
  }
}
