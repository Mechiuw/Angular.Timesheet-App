import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { Overtime, OvertimeResponse, WorkOption } from '../../model/timesheet';
import { OvertimeUpdateService } from '../../services/overtime-update.service';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Observable, of } from 'rxjs';
import { ButtonDirective } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    ValidationMessageComponent,
    ButtonDirective,
    CalendarModule,
    DropdownModule,
    FloatLabelModule,
    PrimeTemplate,
    ToastModule,
    FormsModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [provideNativeDateAdapter(), CurrencyPipe, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevYear = prevMonth === 11 ? year - 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setDate(today.getDate() - 1);

    this.overtimeForm.valueChanges.subscribe(() => {
      this.timesheetService.CalculateTotal(
        this.overtimeForm,
        this.workOptions$
      );
    });
    this.overtimeForm.disable();
  }

  private readonly timesheetService: TimesheetService =
    inject(TimesheetService);
  private readonly updateService: OvertimeUpdateService = inject(
    OvertimeUpdateService
  );

  date: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  @Input() workOptions$: Observable<WorkOption[]> = of([]);

  overtimeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(''),
      selectedDate: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      workID: new FormControl(null, [Validators.required]),
      total: new FormControl(0),
    },
    { validators: this.TimeValidatorForm() }
  );

  setFormValues(overtime: OvertimeResponse) {
    this.workOptions$.subscribe((workOptions) => {
      workOptions.forEach((opt) => {
        if (opt.id == overtime.workId) {
          this.overtimeForm.patchValue({
            ...this.overtimeForm,
            workID: opt,
          });
        }
      });
    });
    this.overtimeForm.patchValue({
      id: overtime.id,
      selectedDate: new Date(overtime.date),
      startTime: new Date(overtime.startTime),
      endTime: new Date(overtime.endTime),
      total: overtime.total,
    });
    if (overtime.id) {
      this.overtimeForm.enable();
    } else {
      this.overtimeForm.disable();
    }
  }

  saveOvertime() {
    if (this.hasEmptyField())
      return this.errorAlert('All form fields must be filled out');

    if (this.overtimeForm.invalid)
      return this.errorAlert(' End time cannot be earlier than start time');

    if (!this.overtimeForm.value.id) {
      return this.errorAlert('Cannot add new overtime');
    }

    if (this.timesheetService.ValidateTime(this.overtimeForm))
      return this.errorAlert('Minimum overtime of 1 hour');

    const formValue = this.overtimeForm.value;

    const overtime: Overtime = {
      id: formValue.id,
      date: formValue.selectedDate,
      startTime: new Date(
        formValue.selectedDate.setTime(formValue.startTime.getTime())
      ),
      endTime: new Date(
        formValue.selectedDate.setTime(formValue.endTime.getTime())
      ),
      workId: formValue.workID.id,
      total: formValue.total,
    };
    this.updateService.Update(overtime).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Overtime edited successfully',
        });
        this.overtimeForm.reset();
        this.overtimeForm.disable();
      },
      (err) => {
        this.errorAlert(err);
        this.overtimeForm.reset();
        this.overtimeForm.disable();
      }
    );
  }

  TimeValidatorForm(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const startTime = formGroup.get('startTime')?.value;
      const endTime = formGroup.get('endTime')?.value;

      if (
        startTime &&
        endTime &&
        new Date(formGroup.get('startTime')?.value) >
          new Date(formGroup.get('endTime')?.value)
      ) {
        return { checkTimeValidator: true };
      }
      return null;
    };
  }

  isFormValid(field: string): boolean {
    const control: AbstractControl = this.overtimeForm.get(
      field
    ) as AbstractControl;
    return control && control.invalid && (control.dirty || control.touched);
  }

  hasEmptyField(): boolean {
    const controls = this.overtimeForm.controls;
    for (const name in controls) {
      if (name !== 'id' && name !== 'total' && !controls[name].value) {
        return true;
      }
    }

    return false;
  }

  resetForm() {
    this.overtimeForm.reset();
  }

  errorAlert(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error Occurred',
      detail: message,
    });
  }
}
