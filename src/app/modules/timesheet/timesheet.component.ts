import { Component } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { FormComponent } from './components/form/form.component';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [ListComponent, FormComponent],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent {}
