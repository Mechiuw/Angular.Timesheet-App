import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  ValidatorFn,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { Overtime, WorkOption } from '../../model/timesheet';
import { OvertimeService } from '../../services/overtime.service';
import { ValidationMessageComponent } from '../validation-message/validation-message.component';
import { TimesheetService } from '../../services/timesheet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
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
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [provideNativeDateAdapter(), CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  minDate: Date | null = null;
  maxDate: Date | null = null;
  descriptionOptions: WorkOption[] = [];

  overtimeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(0),
      selectedDate: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      workID: new FormControl(null, [Validators.required]),
      total: new FormControl(0),
    },
    { validators: this.TimeValidatorForm() }
  );

  constructor(
    private readonly OvertimeService: OvertimeService,
    private readonly timesheetService: TimesheetService
  ) {}
  ngOnInit(): void {
    // this.timesheetService.testFetch();
    this.minDate = this.OvertimeService.getMinDate();
    this.maxDate = this.OvertimeService.getMaxDate();
    this.descriptionOptions = this.timesheetService.GetWorkOptions();
    this.overtimeForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  saveOvertime() {
    if (this.hasEmptyField())
      return this.errorAlert('All form fields must be filled out');

    if (this.overtimeForm.invalid)
      return this.errorAlert(' End time cannot be earlier than start time');

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
      id: new Date().getTime(),
      date: formValue.selectedDate,
      startTime: startTimeISO,
      endTime: endTimeISO,
      workID: formValue.workID,
      total: formValue.total,
    };
    this.OvertimeService.Save(overtime).subscribe(() => {
      // console.log({ overtime });
      Swal.fire({
        icon: 'success',
        text: 'Overtime saved successfully',
        timer: 1000,
      });
      this.overtimeForm.reset();
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
        return { endTimeValidator: true };
      }
      return null;
    };
  }

  calculateTotal(): void {
    const startTime = this.overtimeForm.get('startTime')?.value;
    const endTime = this.overtimeForm.get('endTime')?.value;
    const workID = this.overtimeForm.get('workID')?.value;

    if (startTime && endTime && workID) {
      const work = this.descriptionOptions.find(
        (option) => option.id === workID
      );

      if (!work) {
        return this.overtimeForm
          .get('total')
          ?.setValue(0, { emitEvent: false });
      }

      const fee = work.fee;

      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);

      if (start > end) {
        return this.overtimeForm
          .get('total')
          ?.setValue(0, { emitEvent: false });
      }

      const overtimeHours = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      );

      if (
        overtimeHours >= 2 &&
        work.description.toLowerCase().startsWith('interview')
      ) {
        const total = overtimeHours * 50000;
        return this.overtimeForm
          .get('total')
          ?.setValue(total, { emitEvent: false });
      }
      const total = overtimeHours * fee;
      this.overtimeForm.get('total')?.setValue(total, { emitEvent: false });
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
}
