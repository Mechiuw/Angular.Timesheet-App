import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import {
  Overtime,
  OvertimeResponse,
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
import { EditListComponent } from '../../components/edit-list/edit-list.component';

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
    EditListComponent,
  ],
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss'],
})
export class UpdateTimesheetComponent implements OnInit {
  @ViewChild(EditComponent) formComponent!: EditComponent;

  private readonly updateService = inject(OvertimeUpdateService);
  private readonly timesheetService = inject(TimesheetService);
  private readonly route = inject(ActivatedRoute);

  date: Date = new Date();
  timesheetId: string = '';
  overtimeForm: Overtime[] = [];
  overtimeRes: OvertimeResponse[] = [];
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
          this.overtimeForm = response.timeSheetDetails;
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

  convertToOvertimeResponse(overtime: Overtime): OvertimeResponse {
    const date = new Date(overtime.date);
    const startTime = new Date(overtime.startTime);
    const endTime = new Date(overtime.endTime);
    return {
      id: overtime.id,
      date: date.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      workId: overtime.workId,
      total: overtime.total,
      subTotal: overtime.subTotal!,
    };
  }

  getTotal(): void {
    this.updateService.getTotalPay().subscribe((total) => {
      this.totalPay = total;
    });
  }

  edit(id: any): void {
    const selectedOvertime = this.overtimeForm.find(
      (overtime) => overtime.id === id
    );
    if (selectedOvertime && this.formComponent) {
      console.log('selectedOvertime', selectedOvertime);
      const overtimeResponse = this.convertToOvertimeResponse(selectedOvertime);
      this.formComponent.setFormValues(overtimeResponse);
    }
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
