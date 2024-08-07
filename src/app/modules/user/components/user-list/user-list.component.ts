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

  @ViewChild('dt1') dt: Table | undefined;

  searchValue: string | undefined;

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  users: User[] = [];
  ngOnInit(): void {
    this.users = [
      {
        email: 'ranchodas@gmail.com',
        name: 'rancho',
        role: 'manager',
        status: 'active',
      },
      {
        email: 'jarjit@gmail.com',
        name: 'Jarjit',
        role: 'benefit',
        status: 'active',
      },
      {
        email: 'mael@gmail.com',
        name: 'mael',
        role: 'trainer',
        status: 'active',
      },
    ];
  }
}
