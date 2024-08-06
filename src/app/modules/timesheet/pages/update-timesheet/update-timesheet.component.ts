import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import {
  Overtime,
  Timesheet,
  TimesheetResponse,
  WorkOption,
} from '../../model/timesheet';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { EditComponent } from '../../components/edit-form/edit.component';
import { UpdateButtonComponent } from '../../components/update-button/update-button.component';
import { TotalPayComponent } from '../../components/total-pay/total-pay.component';
import { FormComponent } from '../../components/form/form.component';
import { ListComponent } from '../../components/list/list.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-update-timesheet',
  standalone: true,
  imports: [
    EditComponent,
    UpdateButtonComponent,
    TotalPayComponent,
    FormComponent,
    ListComponent,
    LoadingComponent,
    CommonModule,
  ],
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss'],
})
export class UpdateTimesheetComponent implements OnInit {
  @ViewChild(FormComponent) formComponent!: FormComponent;

  private readonly updateService = inject(OvertimeUpdateService);
  private readonly timesheetService = inject(TimesheetService);
  private readonly route = inject(ActivatedRoute);

  date: Date = new Date();
  timesheetId: string = '';
  overtimeForm: Overtime[] = [];
  totalPay: number = 0;
  isLoading: boolean = true;
  getData: boolean = false;
  workOptions$: Observable<WorkOption[]> = of([]);

  ngOnInit(): void {
    this.fetchWorkOptions();
    this.route.params.subscribe({
      next: (params) => {
        this.timesheetId = params['id'];
        this.fetchDataId();
      },
    });
  }

  fetchDataId(): void {
    this.timesheetService.GetTimesheetById(this.timesheetId).subscribe({
      next: (response: TimesheetResponse) => {
        if (response) {
          // console.log('fetch response', response);
          this.updateService.GetWorks(response.timeSheetDetails).subscribe({
            next: () => {
              this.updateService.List().subscribe((works) => {
                this.overtimeForm = works;
                // console.log('fetch', this.overtimeForm);
                this.getTotal();
              });
              this.isLoading = false;
              this.getData = true;
            },
            error: (err) => console.error('Error adding works', err),
          });
        }
      },
      error: (err: any) => {
        console.error('Error fetching timesheet', err);
        this.isLoading = false;
        this.getData = false;
      },
    });
  }

  getTotal(): void {
    this.updateService.getTotalPay().subscribe((total) => {
      this.totalPay = total;
    });
  }

  remove(id: number): void {
    this.updateService.Delete(id).subscribe(() => {});
  }

  handleFormSubmitted() {
    if (this.formComponent) {
      this.formComponent.resetForm();
    }
  }

  fetchWorkOptions(): void {
    this.workOptions$ = this.timesheetService
      .fethcWorkOptions()
      .pipe(map((data) => data ?? []));
  }
}
