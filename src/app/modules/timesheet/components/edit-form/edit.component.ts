import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import {
  Overtime,
  OvertimeResponse,
  Timesheet,
  WorkOption,
} from '../../model/timesheet';
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
import Swal from 'sweetalert2';
import { map, Observable, of, switchMap } from 'rxjs';

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
  ngOnInit(): void {
    this.minDate = this.updateService.getMinDate();
    this.maxDate = this.updateService.getMaxDate();

    this.overtimeForm.valueChanges.subscribe(() => {
      this.calculateTotal();
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

    if (this.timeValidated())
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
      // console.log({ overtime });
      Swal.fire({
        icon: 'success',
        text: 'Overtime edited successfully',
        timer: 1000,
      });
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

  timeValidated(): boolean {
    const start = this.overtimeForm.get('startTime')?.value;
    const end = this.overtimeForm.get('endTime')?.value;

    const startTime = new Date(`1970-01-01T${start}:00`).getTime();
    const endTime = new Date(`1970-01-01T${end}:00`).getTime();

    const diff = (endTime - startTime) / (1000 * 60 * 60);

    if (diff < 1) {
      return true;
    }
    return false;
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

  calculateTotal(): void {
    const startTime = this.overtimeForm.get('startTime')?.value;
    const endTime = this.overtimeForm.get('endTime')?.value;
    const workID = this.overtimeForm.get('workID')?.value;

    if (startTime && endTime && workID) {
      this.workOptions$
        .pipe(
          map((options: WorkOption[]) =>
            options.find((option) => option.id === workID)
          ),
          switchMap((work) => {
            if (!work) {
              return of(0);
            }

            const fee = work.fee;

            const start = new Date(`1970-01-01T${startTime}:00`);
            const end = new Date(`1970-01-01T${endTime}:00`);

            if (start > end) {
              return of(0);
            }

            const overtimeHours = Math.floor(
              (end.getTime() - start.getTime()) / (1000 * 60 * 60)
            );

            if (
              overtimeHours >= 2 &&
              work.description.toLowerCase().startsWith('interview')
            ) {
              return of(overtimeHours * 50000);
            }

            return of(overtimeHours * fee);
          })
        )
        .subscribe((total) => {
          this.overtimeForm.get('total')?.setValue(total, { emitEvent: false });
        });
    }
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
    Swal.fire({
      icon: 'error',
      text: message,
    });
  }

  getTimeFromISO(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
