import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { User } from '../../models/user.model';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { PagedResponse } from '../../../../core/models/api.model';
import { LazyLoadEvent } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    InputTextModule,
    TagModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    DropdownModule,
    SkeletonModule,
  ],

  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private toaster: ToastrService
  ) {}

  @ViewChild('dt1') dt: Table | undefined;

  searchValue: string = '';

  users: User[] = [];
  first: number | undefined = 0;
  totalRecords: number = 0;
  page: number = 1;
  loading: boolean = true;
  rowsOption: number[] = [5, 10, 50];

  clear(table: Table) {
    this.searchValue = '';
    table.clear();
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadUsers($event: LazyLoadEvent) {
    let rows = $event.rows;
    this.loading = true;
    this.page = Math.ceil(($event?.first ?? 0) / ($event?.rows ?? 1)) + 1;

    if (this.searchValue != '') {
      this.userService.filterUsersByName(this.searchValue || '').subscribe({
        next: (response: PagedResponse<User[]>) => {
          this.totalRecords = response.paging.totalRows;
          rows = response.paging.rowsPerPage;
          this.users = response.data;
          this.loading = false;
        },
        error: (error: any) => {
          this.toaster.error(
            `Error fetching users: ${error}`,
            'Error Occurred'
          );
        },
      });
    } else {
      this.userService.getUsers(rows ?? 1, this.page).subscribe({
        next: (response: PagedResponse<User[]>) => {
          this.totalRecords = response.paging.totalRows;
          rows = response.paging.rowsPerPage;
          this.users = response.data;
          this.loading = false;
        },
        error: (error: any) => {
          this.toaster.error(error, 'Error Occurred');
        },
      });
    }
  }

  ngOnInit() {}
}
