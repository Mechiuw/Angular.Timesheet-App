import { Component, inject, Input } from '@angular/core';
import { Timesheet } from '../../model/timesheet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, SkeletonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private router = inject(Router);

  @Input() dataTable: Timesheet[] = [];

  editTimesheet(id: number) {
    this.router.navigate(['/timesheets/update/' + id]);
  }

  deleteTimesheet(id: number) {
    alert('Delete Timesheet: ' + id);
  }

  viewTimesheet(id: number) {
    this.router.navigate(['/timesheets/view/' + id]);
  }

  submitTimesheet(id: number) {
    alert('Submit Timesheet: ' + id);
  }
}
