import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Overtime, WorkOption } from '../../model/timesheet';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [CommonModule, TableModule],
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
