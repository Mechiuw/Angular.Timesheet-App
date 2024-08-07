import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleService } from '../../service/role.service';
import { Role } from '../../models/role.model';


@Component({
  selector: 'app-select-dropdown',
  templateUrl: './role.list.component.html',
  styleUrls: ['./role.list.component.scss']
})
export class SelectDropdownComponent implements OnInit {
    @Input() placeholder:string  = 'choose the role';
    @Output() selectionChange = new EventEmitter<string>(); 

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

  onSelectionChange(event: Event) :void{
    const selectElement = event.target as HTMLSelectElement;
    this.selectionChange.emit(selectElement.value);
  }
}
