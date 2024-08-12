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
import { ToastrService } from 'ngx-toastr';

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
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [provideNativeDateAdapter(), CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  constructor(private toaster: ToastrService) {}

  ngOnInit(): void {
    this.minDate = this.updateService.getMinDate();
    this.maxDate = this.updateService.getMaxDate();

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

  minDate: Date | null = null;
  maxDate: Date | null = null;
  descriptionOptions: WorkOption[] = [];
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
    this.overtimeForm.patchValue({
      id: overtime.id,
      selectedDate: overtime.date,
      startTime: this.getTimeFromISO(overtime.startTime),
      endTime: this.getTimeFromISO(overtime.endTime),
      workID: overtime.workId,
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
    const selectedDate = formValue.selectedDate;
    const startTimeISO = this.convertTimeToISO(
      selectedDate,
      formValue.startTime
    );
    const endTimeISO = this.convertTimeToISO(selectedDate, formValue.endTime);

    const overtime: Overtime = {
      id: formValue.id,
      date: formValue.selectedDate,
      startTime: startTimeISO,
      endTime: endTimeISO,
      workId: formValue.workID,
      total: formValue.total,
    };
    this.updateService.Update(overtime).subscribe(() => {
      this.toaster.success('Overtime edited successfully', 'Success');
      this.overtimeForm.reset();
      this.overtimeForm.disable();
    });
  }

  convertTimeToISO(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const convert = new Date(date);
    convert.setHours(hours, minutes, 0, 0);
    return convert;
  }

  TimeValidatorForm(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const startTime = formGroup.get('startTime')?.value;
      const endTime = formGroup.get('endTime')?.value;

      if (
        startTime &&
        endTime &&
        new Date(`1970-01-01T${endTime}:00`) <
          new Date(`1970-01-01T${startTime}:00`)
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
    this.toaster.error(message, 'Error Occurred');
  }

  getTimeFromISO(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
