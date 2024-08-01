import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import { Overtime, Timesheet } from '../../model/timesheet';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { EditComponent } from '../../components/edit-form/edit.component';
import { UpdateButtonComponent } from '../../components/update-button/update-button.component';
import { TotalPayComponent } from '../../components/total-pay/total-pay.component';
import { FormComponent } from '../../components/form/form.component';
import { ListComponent } from '../../components/list/list.component';

@Component({
  selector: 'app-update-timesheet',
  standalone: true,
  imports: [
    EditComponent,
    UpdateButtonComponent,
    TotalPayComponent,
    FormComponent,
    ListComponent,
  ],
  templateUrl: './update-timesheet.component.html',
  styleUrls: ['./update-timesheet.component.scss'],
})
export class UpdateTimesheetComponent implements OnInit {
  private readonly updateService = inject(OvertimeUpdateService);
  private readonly timesheetService = inject(TimesheetService);
  private readonly route = inject(ActivatedRoute);

  timesheetId: number = 0;
  overtimeForm: Overtime[] = [];
  totalPay: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.timesheetId = +params['id'];
        this.fetchAndInitData();
      },
    });
  }

  fetchAndInitData(): void {
    this.timesheetService.GetTimsheetById(this.timesheetId).subscribe({
      next: (timesheet: Timesheet) => {
        if (timesheet && timesheet.works) {
          this.updateService.GetWorks(timesheet.works).subscribe({
            next: () => {
              this.updateService.List().subscribe((works) => {
                this.overtimeForm = works;
                this.getTotal();
              });
            },
            error: (err) => console.error('Error adding works', err),
          });
        } else {
          console.warn('No works found in timesheet.');
        }
      },
      error: (err) => console.error('Error fetching timesheet', err),
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
}
