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
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSelectModule } from '@angular/material/select';
import { Overtime } from '../../model/timesheet';
import { OvertimeService } from '../../services/overtime.service';

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
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
  minDate: Date | null = null;
  maxDate: Date | null = null;

  overtimeForm: FormGroup = new FormGroup(
    {
      id: new FormControl(0),
      selectedDate: new FormControl(null),
      startTime: new FormControl(null),
      endTime: new FormControl(null),
      description: new FormControl(null),
      total: new FormControl(0),
    },
    { validators: this.endTimeValidator() }
  );

  descriptionOptions: { value: string; rate: number }[] = [
    { value: 'Interview Kandidat Bootcamp', rate: 30000 },
    { value: 'InstructorLed Basic', rate: 50000 },
    { value: 'InstructorLed Intermediate', rate: 50000 },
    { value: 'Overtime Kelas Karyawan', rate: 50000 },
    { value: 'Other', rate: 50000 },
  ];
  constructor(private readonly OvertimeService: OvertimeService) {}
  ngOnInit(): void {
    this.minDate = this.OvertimeService.getMinDate();
    this.maxDate = this.OvertimeService.getMaxDate();

    this.overtimeForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  saveOvertime() {
    if (this.overtimeForm.valid) {
      const formValue = this.overtimeForm.value;

      const overtime: Overtime = {
        id: new Date().getTime(),
        date: formValue.selectedDate,
        startTime: formValue.startTime,
        endTime: formValue.endTime,
        description: formValue.description,
        total: formValue.total,
      };
      this.OvertimeService.Save(overtime).subscribe(() => {
        this.overtimeForm.reset();
      });
    }
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
        return { endTimeBeforeStart: true };
      }
      return null;
    };
  }

  // Calculate total based on time difference and rate
  calculateTotal(): void {
    const startTime = this.overtimeForm.get('startTime')?.value;
    const endTime = this.overtimeForm.get('endTime')?.value;
    const description = this.overtimeForm.get('description')?.value;

    if (startTime && endTime && description) {
      const rate =
        this.descriptionOptions.find((option) => option.value === description)
          ?.rate || 0;

      // Convert time to Date objects
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

      // Calculate total
      if (overtimeHours >= 2 && rate == 30000) {
        const total = overtimeHours * 50000;
        return this.overtimeForm
          .get('total')
          ?.setValue(total, { emitEvent: false });
      }
      const total = overtimeHours * rate;
      this.overtimeForm.get('total')?.setValue(total, { emitEvent: false });
    }
  }
}
