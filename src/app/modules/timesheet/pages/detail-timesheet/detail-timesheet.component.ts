import { Component, inject, OnInit } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetResponse, WorkOption } from '../../model/timesheet';
import { ActivatedRoute } from '@angular/router';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../components/loading/loading.component';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-detail-timesheet',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './detail-timesheet.component.html',
  styleUrl: './detail-timesheet.component.scss',
})
export class DetailTimesheetComponent implements OnInit {
  private readonly timesheetService = inject(TimesheetService);
  private readonly update = inject(OvertimeUpdateService);
  private readonly route = inject(ActivatedRoute);

  private workDescriptions: { [id: string]: string } = {};
  workOptions$: Observable<WorkOption[]> = of([]);
  detailTimesheet: TimesheetResponse = {} as TimesheetResponse;
  id: string = '';
  isLoading: boolean = true;
  getData: boolean = false;
  total: number = 0;
  date: Date = new Date();

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        this.getDetail(this.id);
        this.fetchWorkOptions();
      },
    });
  }

  getDetail(id: any): void {
    this.timesheetService.GetTimesheetById(id).subscribe({
      next: (response: TimesheetResponse) => {
        if (!response) {
          this.isLoading = false;
        }
        this.detailTimesheet = response;
        // this.update.getDetail(this.detailTimesheet.timeSheetDetails);
        this.total = response.total || 0;
        this.isLoading = false;
        this.getData = true;
      },
    });
  }

  // totalFee(): number {
  //   return this.detailTimesheet.timeSheetDetails.reduce(
  //     (sum, curr) => sum + (curr.total || 0),
  //     0
  //   );
  // }

  fetchWorkOptions(): void {
    this.workOptions$ = this.timesheetService
      .FetchWorkOptions()
      .pipe(map((data) => data ?? []));

    this.workOptions$.subscribe((options) => {
      options.forEach((option) => {
        this.workDescriptions[option.id] = option.description;
      });
    });
  }

  getWorkDescription(id: string): string {
    return this.workDescriptions[id] || 'Unknown';
  }

  print() {
    window.print();
  }
}
