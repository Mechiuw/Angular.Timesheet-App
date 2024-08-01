import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimesheetService } from '../../services/timesheet.service';
import { Overtime, Timesheet } from '../../model/timesheet';
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
    this.descriptionOptions = this.timesheetService.GetWorkOptions();
    this.overtimeForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  private readonly timesheetService: TimesheetService =
    inject(TimesheetService);
  private readonly updateService: OvertimeUpdateService = inject(
    OvertimeUpdateService
  );

  minDate: Date | null = null;
  maxDate: Date | null = null;
  descriptionOptions: { id: number; desc: string; fee: number }[] = [];
  overtimeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(0),
      selectedDate: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      workID: new FormControl(null, [Validators.required]),
      total: new FormControl(0),
    },
    { validators: this.endTimeValidator() }
  );

  saveOvertime() {
    if (this.overtimeForm.pristine)
      return alert('All form fields must be filled out.pristine');

    if (this.hasEmptyField())
      return alert('All form fields must be filled out');

    if (this.overtimeForm.invalid)
      return alert('Start time must be earlier than end time');

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
    this.updateService.Update(overtime).subscribe(() => {
      // console.log({ overtime });
      this.overtimeForm.reset();
    });
  }

  convertTimeToISO(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const convert = new Date(date);
    convert.setHours(hours, minutes, 0, 0);
    return convert;
  }

  // Custom validator function
  endTimeValidator(): ValidatorFn {
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
    const description = this.overtimeForm.get('workID')?.value;

    if (startTime && endTime && description) {
      const fee =
        this.descriptionOptions.find((option) => option.id === description)
          ?.fee || 0;

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

      if (overtimeHours >= 2 && description == 1) {
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
}
