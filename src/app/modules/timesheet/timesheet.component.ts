import { Component } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { FormComponent } from './components/form/form.component';
import { CommonModule } from '@angular/common';
import { TotalPayComponent } from './components/total-pay/total-pay.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from './components/edit-form/edit.component';
import { UpdateButtonComponent } from './components/update-button/update-button.component';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent {}
