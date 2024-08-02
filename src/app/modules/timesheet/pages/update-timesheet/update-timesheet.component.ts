import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import { Overtime, Timesheet } from '../../model/timesheet';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { EditComponent } from '../../components/edit-form/edit.component';
import { UpdateButtonComponent } from '../../components/update-button/update-button.component';
import { TotalPayComponent } from '../../components/total-pay/total-pay.component';
import { FormComponent } from '../../components/form/form.component';
import { ListComponent } from '../../components/list/list.component';
import { LoadingComponent } from '../../components/loading/loading.component';
import { CommonModule } from '@angular/common';

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
  private readonly router = inject(Router);

  date: Date = new Date();
  timesheetId: number = 0;
  overtimeForm: Overtime[] = [];
  totalPay: number = 0;
  isLoading: boolean = true;
  getData: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.timesheetId = +params['id'];
        this.fetchData();
      },
    });
  }

  fetchData(): void {
    this.timesheetService.GetTimsheetById(this.timesheetId).subscribe({
      next: (response: Timesheet) => {
        if (response) {
          this.updateService.GetWorks(response.works).subscribe({
            next: () => {
              this.updateService.List().subscribe((works) => {
                this.overtimeForm = works;
                this.getTotal();
              });
              this.isLoading = false;
              this.getData = true;
            },
            error: (err) => console.error('Error adding works', err),
          });
        }
      },
      error: (err) => {
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
}
