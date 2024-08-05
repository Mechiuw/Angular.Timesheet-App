import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { User } from '../../models/user.model';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, DropdownModule],

  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  ngOnInit(): void {
    this.users = [
      {
        "email": "ranchodas@gmail.com",
        "name": "rancho",
        "role": "manager",
        "status": "active"
      },
      {
        "email": "jarjit@gmail.com",
        "name": "Jarjit",
        "role": "benefit",
        "status": "active"
      },
      {
        "email": "mael@gmail.com",
        "name": "mael",
        "role": "trainer",
        "status": "active"
      }
    ]
  }

}
