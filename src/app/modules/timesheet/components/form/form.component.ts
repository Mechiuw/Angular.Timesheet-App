import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { Overtime, WorkOption } from '../../model/timesheet';
import { OvertimeService } from '../../services/overtime.service';
import { ValidationMessageComponent } from '../../../../shared/components/validation-message/validation-message.component';
import { TimesheetService } from '../../services/timesheet.service';
import { Observable, of } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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
    CalendarModule,
    FormsModule,
    FloatLabelModule,
    DropdownModule,
    ToastModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [provideNativeDateAdapter(), CurrencyPipe, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  date: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  @Input() workOptions$: Observable<WorkOption[]> = of([]);

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
    private readonly timesheetService: TimesheetService,
    private readonly messageService: MessageService
  ) {}

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
  }

  saveOvertime() {
    if (this.hasEmptyField()) {
      return this.errorAlert('All form fields must be filled out');
    }

    if (this.overtimeForm.invalid) {
      return this.errorAlert(' End time cannot be earlier than start time');
    }

    if (this.timesheetService.ValidateTime(this.overtimeForm)) {
      return this.errorAlert(
        'Minimum overtime of 1 hour or must be a multiple of 1 hour'
      );
    }

    const formValue = this.overtimeForm.value;

    const overtime: Overtime = {
      id: new Date().getTime(),
      date: formValue.selectedDate,
      startTime: formValue.selectedDate.setTime(formValue.startTime.getTime()),
      endTime: formValue.selectedDate.setTime(formValue.endTime.getTime()),
      workId: formValue.workID.id,
      total: formValue.total,
    };
    this.OvertimeService.Save(overtime).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Overtime saved successfully',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error Occurred',
          detail: 'Failed to create overtime',
        });
      },
      () => {
        this.overtimeForm.reset();
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

  protected readonly String = String;
}
