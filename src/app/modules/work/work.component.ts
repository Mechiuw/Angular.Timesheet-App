import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WorkFormComponent } from "./components/work-form/work-form.component";
import { WorkListComponent } from "./components/work-list/work-list.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-work",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkFormComponent,
    WorkListComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: "./work.component.html",
  styleUrl: "./work.component.scss",
})
export class WorkComponent {}
