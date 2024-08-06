import { Component, inject, OnInit } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { Timesheet, WorkOption } from '../../model/timesheet';
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

  // descriptionOptions: WorkOption[] = [];
  private workDescriptions: { [id: string]: string } = {};
  workOptions$: Observable<WorkOption[]> = of([]);
  detailTimesheet: Timesheet = {} as Timesheet;
  id: number = 0;
  isLoading: boolean = true;
  getData: boolean = false;
  total: number = 0;
  date: Date = new Date();

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.id = +params['id'];
        this.getDetail(this.id);
        this.fetchWorkOptions();
      },
    });
  }

  getDetail(id: number): void {
    this.timesheetService.GetTimsheetById(id).subscribe({
      next: (response: Timesheet) => {
        if (!response) {
          this.isLoading = false;
        }
        this.detailTimesheet = response;
        this.update.getDetail(this.detailTimesheet.works);
        this.total = this.totalFee();
        this.isLoading = false;
        this.getData = true;
      },
    });
  }

  totalFee(): number {
    return this.detailTimesheet.works.reduce(
      (sum, curr) => sum + (curr.total || 0),
      0
    );
  }

  fetchWorkOptions(): void {
    this.workOptions$ = this.timesheetService
      .fethcWorkOptions()
      .pipe(map((data) => data ?? []));

    this.workOptions$.subscribe((options) => {
      // console.log('Options:', options);
      options.forEach((option) => {
        // console.log('Option ID:', option.id);
        this.workDescriptions[option.id] = option.description;
      });
      // console.log('Work Descriptions:', this.workDescriptions);
    });
  }

  getWorkDescription(id: string): string {
    return this.workDescriptions[id] || 'Unknown';
  }

  print() {
    window.print();
  }
}
