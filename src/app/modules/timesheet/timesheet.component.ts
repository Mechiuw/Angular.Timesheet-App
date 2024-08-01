import { Component } from '@angular/core';
import { ListComponent } from './components/list/list.component';
import { FormComponent } from './components/form/form.component';
import { CommonModule } from '@angular/common';
import { TotalPayComponent } from './components/total-pay/total-pay.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { ActivatedRoute } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [
    ListComponent,
    FormComponent,
    CommonModule,
    TotalPayComponent,
    SubmitButtonComponent,
    EditComponent,
  ],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent {
  date: Date = new Date();
  isEditMode = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isEditMode = !!params['id'];
    });
  }
}
