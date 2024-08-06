import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleService } from '../service/role.service';
import { Role } from '../models/role.model';
import { error, log } from 'console';

interface SelectItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './role.list.component.html',
  styleUrls: ['./role.list.component.scss']
})
export class SelectDropdownComponent implements OnInit {
  roles : Role[] = [];
  loading: boolean = false;

  constructor(
    private roleService : RoleService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
        next: (response) => {
            this.roles = response.data,
            this.loading = false;
        },
        error : (error) => {
            console.log('Error Fetching Data',error);
            this.loading = false;
        }
    })
  }
}
