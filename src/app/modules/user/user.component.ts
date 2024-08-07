import { Component, OnInit } from '@angular/core';
import { UserFormComponent } from "./components/user-form/user-form.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { UserService } from './services/user.service';
import { log } from 'console';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserFormComponent, UserListComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  constructor(
    private readonly userService: UserService
  ){

  }
  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      console.log({users});
    })
  }

}
