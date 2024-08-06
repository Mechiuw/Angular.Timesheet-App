import { Component, inject, Input, OnInit } from '@angular/core';
import { Overtime, WorkOption } from '../../model/timesheet';
import { CommonModule } from '@angular/common';
import { TimesheetService } from '../../services/timesheet.service';
import { TableModule } from 'primeng/table';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  @Input() overtimeForm: Overtime[] = [];
  @Input() delete!: (id: any) => void;

  private workDescriptions: { [id: string]: string } = {};
  @Input() workOptions$: Observable<WorkOption[]> = of([]);

  ngOnInit(): void {
    this.workOptions$.subscribe((options) => {
      // console.log('Options:', options);
      options.forEach((option) => {
        // console.log('Option ID:', option.id);
        this.workDescriptions[option.id] = option.description;
      });
      // console.log('Work Descriptions:', this.workDescriptions);
    });
  }

  getWorkDescription(id: string): string {
    // console.log('Work Descriptions ID:', id);
    // console.log('Work Descriptions:', this.workDescriptions);
    return this.workDescriptions[id] || 'Unknown';
  }
}
