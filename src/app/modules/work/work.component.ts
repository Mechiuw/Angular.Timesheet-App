import { Component } from '@angular/core';
import { WorkFormComponent } from "./components/work-form/work-form.component";
import { WorkListComponent } from "./components/work-list/work-list.component";

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [WorkFormComponent, WorkListComponent],
  templateUrl: './work.component.html',
  styleUrl: './work.component.scss'
})
export class WorkComponent {

}
