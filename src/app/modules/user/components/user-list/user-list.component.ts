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
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  providers: [MessageService],
})
export class UserListComponent implements OnInit {
  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  @ViewChild('dt1') dt: Table | undefined;

  searchValue: string = '';

  users: User[] = [];
  first: number | undefined = 0;
  totalRecords: number = 0;
  page: number = 1;
  loading: boolean = true;
  rowsOption: number[] = [5, 10, 50];

  // Data Enum Status User
  StatusUsersEnum = {
    ACTIVE: StatusUsers.ACTIVE,
    INACTIVE: StatusUsers.INACTIVE,
  };

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
          this.messageService.add({
            severity: 'error',
            summary: 'Error Occurred',
            detail: `Error fetching users: ${error}`,
          });
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
          this.messageService.add({
            severity: 'error',
            summary: 'Error Occurred',
            detail: error,
          });
        },
      });
    }
  }

  ngOnInit() {
    // Subscribe to the observable to get real-time updates
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });

    // Initial load
    this.userService.updateUsers();
  }
}
