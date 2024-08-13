import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import {
  Overtime,
  OvertimeResponse,
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
import { SubmitButtonComponent } from '../../components/submit-button/submit-button.component';
import { TitleHeaderComponent } from '../../../../shared/components/title-header/title-header.component';
import { MessageService } from 'primeng/api';
import {ToastModule} from "primeng/toast";

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
    SubmitButtonComponent,
    TitleHeaderComponent,
    ToastModule,
  ],
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss'],
  providers: [MessageService],
})
export class UpdateTimesheetComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  @ViewChild(EditComponent) formComponent!: EditComponent;

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

  title: string = 'Timesheet Update Form';
  subtitle: string = 'Update';

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
          this.overtimeForm = response.timeSheetDetails;
          this.updateService.GetWorks(response.timeSheetDetails).subscribe({
            next: () => {
              this.updateService.List().subscribe((works) => {
                this.overtimeForm = works;
                this.getTotal();
              });
              this.isLoading = false;
              this.getData = true;
            },
            error: (err) => {
              this.isLoading = false;
              this.getData = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error Occurred',
                detail: `Error adding works: ${err}`,
              });
            },
          });
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.getData = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Occurred',
          detail: `Error fetching timesheet: ${err}`,
        });
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
      .FetchWorkOptions()
      .pipe(map((data) => data ?? []));
  }
}
