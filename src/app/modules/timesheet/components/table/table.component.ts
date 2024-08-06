import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { Timesheet } from '../../model/timesheet';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TimesheetService } from '../../services/timesheet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, SkeletonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  private router = inject(Router);
  private timesheetService = inject(TimesheetService);

  @Input() dataTable: Timesheet[] = [];
  @Output() timesheetDeleted = new EventEmitter<void>();

  editTimesheet(id: number) {
    this.router.navigate(['/timesheets/update/' + id]);
  }

  submitTimesheet(id: any) {
    Swal.fire({
      title: 'Are you sure Proceed?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.timesheetService.SubmitTimesheet(id).subscribe(
          (response) => {
            console.log('Timesheet submitted successfully', response);
            console.log({ id });
            Swal.fire(
              'Submitted!',
              'Your timesheet has been submitted.',
              'success'
            );
            this.timesheetDeleted.emit();
          },
          (error) => {
            console.error('Error submitting timesheet', error);
            Swal.fire(
              'Error!',
              'There was a problem submitting the timesheet. Please try again later.',
              'error'
            );
          }
        );
      }
    });
  }

  viewTimesheet(id: number) {
    this.router.navigate(['/timesheets/view/' + id]);
  }

  deleteTimesheet(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.timesheetService.DeleteTimesheet(id).subscribe(
          (response) => {
            // console.log('Timesheet deleted successfully', response);
            Swal.fire(
              'Deleted!',
              'Your timesheet has been deleted.',
              'success'
            );
            this.timesheetDeleted.emit();
          },
          (error) => {
            // console.error('Error deleting timesheet', error);
            Swal.fire(
              'Error!',
              'There was a problem deleting the timesheet. Please try again later.',
              'error'
            );
          }
        );
      }
    });
  }
}
