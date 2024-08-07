import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { User } from '../../models/user.model';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { NftHeaderComponent } from '../../../dashboard/components/nft/nft-header/nft-header.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { PagedResponse } from '../../../../core/models/api.model';
import { LazyLoadEvent } from 'primeng/api';

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
    NftHeaderComponent,
  ],

  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {

  constructor(private userService: UserService) {}

  @ViewChild('dt1') dt: Table | undefined;

  searchValue: string | undefined;

  users: User[] = [];
  first: number | undefined = 0;
  totalRecords: number = 0;
  page: number = 1;
  loading: boolean = false;
  rowsOption: number[] = [1,2,5]

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }


  loadUsers($event: LazyLoadEvent) {
    let rows = $event.rows
    this.loading = true; 
    this.page = Math.ceil(($event?.first ?? 0) / ($event?.rows ?? 1)) + 1

    this.userService.getUsers(rows ?? 1, this.page).subscribe({
      next: (response: PagedResponse<User[]>) => {
        this.totalRecords = response.paging.totalRows
        rows = response.paging.rowsPerPage
        this.users = response.data
        this.loading = false
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  ngOnInit() {

  }
}
