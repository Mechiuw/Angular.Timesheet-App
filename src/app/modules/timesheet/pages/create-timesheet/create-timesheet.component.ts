import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SubmitButtonComponent } from '../../components/submit-button/submit-button.component';
import { TotalPayComponent } from '../../components/total-pay/total-pay.component';
import { ListComponent } from '../../components/list/list.component';
import { FormComponent } from '../../components/form/form.component';
import { CommonModule } from '@angular/common';
import { OvertimeService } from '../../services/overtime.service';
import { Overtime, WorkOption } from '../../model/timesheet';
import { Observable, of, map } from 'rxjs';
import { TimesheetService } from '../../services/timesheet.service';

@Component({
  selector: 'app-create-timesheet',
  standalone: true,
  imports: [
    SubmitButtonComponent,
    TotalPayComponent,
    ListComponent,
    FormComponent,
    CommonModule,
  ],
  templateUrl: './create-timesheet.component.html',
  styleUrl: './create-timesheet.component.scss',
})
export class CreateTimesheetComponent implements OnInit {
  @ViewChild(FormComponent) formComponent!: FormComponent;
  private readonly overtimeService = inject(OvertimeService);
  private readonly timesheetService = inject(TimesheetService);

  overtimeForm: Overtime[] = [];
  date: Date = new Date();
  totalPay: number = 0;
  workOptions$: Observable<WorkOption[]> = of([]);

  ngOnInit(): void {
    this.getTotal();
    this.initData();
    this.fetchWorkOptions();
  }

  getTotal(): void {
    this.overtimeService.getTotalPay().subscribe((total) => {
      this.totalPay = total;
    });
  }

  initData(): void {
    this.overtimeService.List().subscribe((data) => {
      this.overtimeForm = data;
    });
  }

  remove(id: any) {
    this.overtimeService.Delete(id).subscribe(() => {
      this.initData();
    });
  }

  handleFormSubmitted() {
    if (this.formComponent) {
      this.formComponent.resetForm();
    }
  }

  fetchWorkOptions(): void {
    console.log('fetch work options', this.workOptions$);
    this.workOptions$ = this.timesheetService
      .fethcWorkOptions()
      .pipe(map((data) => data ?? []));
  }
}
