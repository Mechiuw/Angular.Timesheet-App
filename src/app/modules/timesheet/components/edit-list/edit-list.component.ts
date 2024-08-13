import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Overtime, WorkOption } from '../../model/timesheet';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {RupiahFormatPipe} from "../../../../shared/pipes/rupiah-format.pipe";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [CommonModule, TableModule, RupiahFormatPipe, TooltipModule],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss',
})
export class EditListComponent implements OnInit {
  @Input() overtimeForm: Overtime[] = [];
  @Input() edit!: (id: any) => void;

  private workDescriptions: { [id: string]: string } = {};
  @Input() workOptions$: Observable<WorkOption[]> = of([]);

  ngOnInit(): void {
    this.workOptions$.subscribe((options) => {
      options.forEach((option) => {
        this.workDescriptions[option.id] = option.description;
      });
    });
  }

  getWorkDescription(id: string): string {
    return this.workDescriptions[id] || 'Unknown';
  }
}
