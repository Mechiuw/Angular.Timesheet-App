import { Component, inject, Input, OnInit } from '@angular/core';
import { Overtime } from '../../model/timesheet';
import { CommonModule } from '@angular/common';
import { TimesheetService } from '../../services/timesheet.service';
import { TableModule } from 'primeng/table';

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

  private readonly timesheetService = inject(TimesheetService);

  descriptionOptions: { id: number; desc: string; fee: number }[] = [];

  ngOnInit(): void {
    this.descriptionOptions = this.timesheetService.GetWorkOptions();
  }

  getWorkDescription(id: number): string {
    const option = this.descriptionOptions.find((opt) => opt.id === id);
    return option ? option.desc : 'Unknown';
  }
}
