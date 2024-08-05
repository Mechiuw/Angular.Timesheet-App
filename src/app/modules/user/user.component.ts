import { Component } from '@angular/core';
import { UserFormComponent } from "./components/user-form/user-form.component";
import { UserListComponent } from "./components/user-list/user-list.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [UserFormComponent, UserListComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

}
