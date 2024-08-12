import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleService } from '../../service/role.service';
import { Role } from '../../models/role.model';
import {NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-select-dropdown',
  templateUrl: './role.list.component.html',
  standalone: true,
  styleUrls: ['./role.list.component.scss'],
  imports: [NgIf, NgForOf],
})
export class RoleDropdownComponent implements OnInit {
  @Input() placeholder: string = 'Choose the role';
  @Output() selectionChange = new EventEmitter<string>();

  roles: Role[] = [];
  loading: boolean = false;

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe({
      next: (response: Role[]) => {
        this.roles = response;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectionChange.emit(selectElement.value);
  }
}
export default RoleDropdownComponent;
